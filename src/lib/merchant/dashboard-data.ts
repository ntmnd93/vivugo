import { prisma } from "@/lib/prisma";
import { LedgerPartyType } from "@prisma/client";
import { getActiveSplitConfig } from "@/lib/ledger/split-config";

export type MerchantDashboardOrder = {
  orderId: string;
  travelerName: string | null;
  paidAt: string | null;
  items: string[];
  totalVnd: number;
  merchantShareVnd: number;
  platformShareVnd: number;
  logisticsShareVnd: number;
};

export type MerchantDashboardData = {
  orderCount: number;
  totalSalesVnd: number;
  merchantShareVnd: number;
  platformShareVnd: number;
  logisticsShareVnd: number;
  recentOrders: MerchantDashboardOrder[];
  splitPct: { merchantPct: number; logisticsPct: number; platformPct: number };
};

export async function getMerchantDashboardData(merchantId: string): Promise<MerchantDashboardData> {
  const items = await prisma.orderItem.findMany({
    where: { merchantId, order: { status: "PAID" } },
    include: { service: true, order: true, ledgerEntries: true },
    orderBy: { order: { paidAt: "desc" } },
  });

  let totalSalesVnd = 0;
  let merchantShareVnd = 0;
  let platformShareVnd = 0;
  let logisticsShareVnd = 0;

  const orderMap = new Map<string, MerchantDashboardOrder>();

  for (const item of items) {
    totalSalesVnd += item.lineTotalVnd;

    const entry = orderMap.get(item.orderId) ?? {
      orderId: item.orderId,
      travelerName: item.order.travelerName,
      paidAt: item.order.paidAt?.toISOString() ?? null,
      items: [],
      totalVnd: 0,
      merchantShareVnd: 0,
      platformShareVnd: 0,
      logisticsShareVnd: 0,
    };
    entry.items.push(item.service.name);
    entry.totalVnd += item.lineTotalVnd;

    for (const ledger of item.ledgerEntries) {
      if (ledger.partyType === LedgerPartyType.MERCHANT) {
        merchantShareVnd += ledger.amountVnd;
        entry.merchantShareVnd += ledger.amountVnd;
      } else if (ledger.partyType === LedgerPartyType.PLATFORM) {
        platformShareVnd += ledger.amountVnd;
        entry.platformShareVnd += ledger.amountVnd;
      } else if (ledger.partyType === LedgerPartyType.LOGISTICS) {
        logisticsShareVnd += ledger.amountVnd;
        entry.logisticsShareVnd += ledger.amountVnd;
      }
    }

    orderMap.set(item.orderId, entry);
  }

  const recentOrders = Array.from(orderMap.values())
    .sort((a, b) => (!a.paidAt || !b.paidAt ? 0 : b.paidAt.localeCompare(a.paidAt)))
    .slice(0, 20);

  const config = await getActiveSplitConfig();

  return {
    orderCount: orderMap.size,
    totalSalesVnd,
    merchantShareVnd,
    platformShareVnd,
    logisticsShareVnd,
    recentOrders,
    splitPct: {
      merchantPct: config.merchantPct,
      logisticsPct: config.logisticsPct,
      platformPct: config.platformPct,
    },
  };
}
