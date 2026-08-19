import { prisma } from "@/lib/prisma";
import { LedgerPartyType } from "@prisma/client";

export type TopMerchant = {
  merchantId: string;
  name: string;
  type: string;
  gmvVnd: number;
  orderCount: number;
};

export type PlatformOverview = {
  totalGmvVnd: number;
  platformCommissionVnd: number;
  merchantPayoutVnd: number;
  logisticsVnd: number;
  paidOrderCount: number;
  merchantCount: number;
  topMerchants: TopMerchant[];
};

export async function getPlatformOverview(): Promise<PlatformOverview> {
  const [items, ledgerEntries, paidOrderCount, merchantCount] = await Promise.all([
    prisma.orderItem.findMany({
      where: { order: { status: "PAID" } },
      include: { merchant: true },
    }),
    prisma.ledgerEntry.findMany(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.merchant.count(),
  ]);

  const totalGmvVnd = items.reduce((sum, i) => sum + i.lineTotalVnd, 0);

  let platformCommissionVnd = 0;
  let merchantPayoutVnd = 0;
  let logisticsVnd = 0;
  for (const entry of ledgerEntries) {
    if (entry.partyType === LedgerPartyType.PLATFORM) platformCommissionVnd += entry.amountVnd;
    else if (entry.partyType === LedgerPartyType.MERCHANT) merchantPayoutVnd += entry.amountVnd;
    else if (entry.partyType === LedgerPartyType.LOGISTICS) logisticsVnd += entry.amountVnd;
  }

  const merchantMap = new Map<string, TopMerchant>();
  for (const item of items) {
    const existing = merchantMap.get(item.merchantId) ?? {
      merchantId: item.merchantId,
      name: item.merchant.name,
      type: item.merchant.type,
      gmvVnd: 0,
      orderCount: 0,
    };
    existing.gmvVnd += item.lineTotalVnd;
    existing.orderCount += 1;
    merchantMap.set(item.merchantId, existing);
  }

  const topMerchants = Array.from(merchantMap.values())
    .sort((a, b) => b.gmvVnd - a.gmvVnd)
    .slice(0, 8);

  return {
    totalGmvVnd,
    platformCommissionVnd,
    merchantPayoutVnd,
    logisticsVnd,
    paidOrderCount,
    merchantCount,
    topMerchants,
  };
}
