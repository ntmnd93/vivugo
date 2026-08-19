import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getActiveSplitConfig } from "@/lib/ledger/split-config";
import { computeSplit } from "@/lib/ledger/compute-split";
import { buildTicketPayload } from "@/lib/qr/generate";
import { LedgerPartyType } from "@prisma/client";

/**
 * DemoPayment: no real payment gateway, but the side effects are real —
 * ledger split entries and a redeemable QR ticket. This is the single place
 * a paid order gets its commission split written, so the merchant dashboard
 * numbers always trace back to here.
 */
export async function applyPayment(orderId: string) {
  const existing = await prisma.order.findUnique({ where: { id: orderId }, include: { ticket: true } });
  if (!existing) throw new Error("Không tìm thấy đơn hàng.");
  if (existing.status === "PAID") {
    if (existing.ticket) return existing;
    // Order marked PAID but ticket creation previously failed — fall through and repair.
  }

  const config = await getActiveSplitConfig();

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new Error("Không tìm thấy đơn hàng.");

    for (const item of order.items) {
      const split = computeSplit(item.lineTotalVnd, config);
      await tx.ledgerEntry.createMany({
        data: [
          {
            orderId: order.id,
            orderItemId: item.id,
            partyType: LedgerPartyType.MERCHANT,
            merchantId: item.merchantId,
            amountVnd: split.merchant,
            percentApplied: config.merchantPct,
          },
          {
            orderId: order.id,
            orderItemId: item.id,
            partyType: LedgerPartyType.LOGISTICS,
            amountVnd: split.logistics,
            percentApplied: config.logisticsPct,
          },
          {
            orderId: order.id,
            orderItemId: item.id,
            partyType: LedgerPartyType.PLATFORM,
            amountVnd: split.platform,
            percentApplied: config.platformPct,
          },
        ],
      });
    }

    if (order.status !== "PAID") {
      await tx.order.update({ where: { id: order.id }, data: { status: "PAID", paidAt: new Date() } });
    }

    const ticketId = randomUUID();
    const ticket = await tx.ticket.create({
      data: {
        id: ticketId,
        orderId: order.id,
        qrPayload: buildTicketPayload(ticketId),
      },
    });

    return { ...order, status: "PAID" as const, ticket };
  });
}
