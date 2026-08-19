import { prisma } from "@/lib/prisma";
import type { SplitConfig } from "@prisma/client";

const FALLBACK: Pick<SplitConfig, "merchantPct" | "logisticsPct" | "platformPct"> = {
  merchantPct: Number(process.env.SPLIT_MERCHANT_PCT ?? 85),
  logisticsPct: Number(process.env.SPLIT_LOGISTICS_PCT ?? 10),
  platformPct: Number(process.env.SPLIT_PLATFORM_PCT ?? 5),
};

/**
 * Single source of truth for the commission split. Reads the DB-backed active
 * config (so it's provably configurable, not a hardcoded number) and falls
 * back to env defaults only if the table hasn't been seeded yet.
 */
export async function getActiveSplitConfig(): Promise<
  Pick<SplitConfig, "merchantPct" | "logisticsPct" | "platformPct">
> {
  const config = await prisma.splitConfig.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
  const resolved = config ?? FALLBACK;

  const total = resolved.merchantPct + resolved.logisticsPct + resolved.platformPct;
  if (Math.abs(total - 100) > 0.01) {
    throw new Error(`Cấu hình chia hoa hồng không hợp lệ: tổng % = ${total}, phải bằng 100.`);
  }

  return resolved;
}
