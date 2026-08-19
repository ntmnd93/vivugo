import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { allocateDiscountedLineTotals } from "@/lib/pricing/combo-pricing";

const bodySchema = z.object({
  comboId: z.string().min(1),
  travelerName: z.string().trim().max(80).optional(),
  travelerContact: z.string().trim().max(120).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const { comboId, travelerName, travelerContact } = parsed.data;

  const combo = await prisma.combo.findUnique({
    where: { id: comboId },
    include: { items: { include: { service: true } } },
  });

  if (!combo) {
    return NextResponse.json({ error: "Không tìm thấy combo." }, { status: 404 });
  }

  const lineTotals = allocateDiscountedLineTotals(
    combo.items.map((ci) => ({ unitPriceVnd: ci.unitPriceVnd, quantity: ci.quantity })),
    combo.totalVnd
  );

  const order = await prisma.order.create({
    data: {
      comboId: combo.id,
      status: "PENDING",
      totalVnd: combo.totalVnd,
      travelerName,
      travelerContact,
      items: {
        create: combo.items.map((ci, index) => ({
          serviceId: ci.serviceId,
          merchantId: ci.service.merchantId,
          unitPriceVnd: ci.unitPriceVnd,
          quantity: ci.quantity,
          lineTotalVnd: lineTotals[index],
        })),
      },
    },
  });

  return NextResponse.json({ id: order.id });
}
