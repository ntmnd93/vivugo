import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseTicketPayload } from "@/lib/qr/validate";
import { getActiveMerchantId } from "@/lib/demo-auth/merchant-session";

const bodySchema = z.object({ qrPayload: z.string().min(1) });

export async function POST(req: NextRequest) {
  const merchantId = await getActiveMerchantId();
  if (!merchantId) {
    return NextResponse.json({ error: "Bạn cần đăng nhập merchant trước." }, { status: 401 });
  }

  const parsedBody = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const parsedPayload = parseTicketPayload(parsedBody.data.qrPayload);
  if (!parsedPayload) {
    return NextResponse.json({ error: "Mã QR không hợp lệ hoặc đã bị chỉnh sửa." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parsedPayload.ticketId },
    include: {
      order: {
        include: { items: { include: { service: true } } },
      },
      redemptions: true,
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Không tìm thấy vé." }, { status: 404 });
  }

  const myItems = ticket.order.items.filter((i) => i.merchantId === merchantId);
  if (myItems.length === 0) {
    return NextResponse.json(
      { error: "Vé này không có dịch vụ nào thuộc doanh nghiệp của bạn." },
      { status: 403 }
    );
  }

  const redeemedItemIds = new Set(ticket.redemptions.map((r) => r.orderItemId));
  const results: { serviceName: string; alreadyRedeemed: boolean }[] = [];
  const newRedemptions: { orderItemId: string }[] = [];

  for (const item of myItems) {
    const already = redeemedItemIds.has(item.id);
    results.push({ serviceName: item.service.name, alreadyRedeemed: already });
    if (!already) newRedemptions.push({ orderItemId: item.id });
  }

  if (newRedemptions.length > 0) {
    await prisma.$transaction(async (tx) => {
      await tx.ticketRedemption.createMany({
        data: newRedemptions.map((r) => ({
          ticketId: ticket.id,
          orderItemId: r.orderItemId,
          merchantId,
        })),
      });

      const totalRedeemed = ticket.redemptions.length + newRedemptions.length;
      if (totalRedeemed >= ticket.order.items.length) {
        await tx.ticket.update({
          where: { id: ticket.id },
          data: { status: "REDEEMED", redeemedAt: new Date() },
        });
      }
    });
  }

  return NextResponse.json({
    travelerName: ticket.order.travelerName,
    items: results,
  });
}
