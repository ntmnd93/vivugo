import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { computeComboPrice } from "@/lib/pricing/combo-pricing";

const bodySchema = z.object({
  itineraryId: z.string().min(1),
  itineraryItemIds: z.array(z.string().min(1)).min(1, "Chọn ít nhất một dịch vụ."),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const { itineraryId, itineraryItemIds } = parsed.data;

  const items = await prisma.itineraryItem.findMany({
    where: { id: { in: itineraryItemIds }, itineraryId },
    include: { service: true },
  });

  if (items.length === 0) {
    return NextResponse.json({ error: "Không tìm thấy dịch vụ đã chọn." }, { status: 404 });
  }

  const price = computeComboPrice(items.map((i) => ({ unitPriceVnd: i.service.priceVnd, quantity: 1 })));

  const combo = await prisma.combo.create({
    data: {
      itineraryId,
      title: `Combo ${items.length} dịch vụ`,
      subtotalVnd: price.subtotalVnd,
      discountVnd: price.discountVnd,
      totalVnd: price.totalVnd,
      items: {
        create: items.map((i) => ({
          serviceId: i.serviceId,
          itineraryItemId: i.id,
          unitPriceVnd: i.service.priceVnd,
          quantity: 1,
        })),
      },
    },
  });

  return NextResponse.json({ id: combo.id });
}
