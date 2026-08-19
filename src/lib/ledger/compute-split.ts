export type SplitPercentages = {
  merchantPct: number;
  logisticsPct: number;
  platformPct: number;
};

export type SplitAmounts = {
  merchant: number;
  logistics: number;
  platform: number;
};

/**
 * Pure split computation. Rounds each share to the nearest VND and assigns the
 * rounding remainder to the platform share so the three amounts always sum
 * exactly to `amountVnd` — the ledger dashboard totals must never drift.
 */
export function computeSplit(amountVnd: number, config: SplitPercentages): SplitAmounts {
  const merchant = Math.round((amountVnd * config.merchantPct) / 100);
  const logistics = Math.round((amountVnd * config.logisticsPct) / 100);
  const platform = amountVnd - merchant - logistics;

  return { merchant, logistics, platform };
}
