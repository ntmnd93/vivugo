export type PriceableItem = {
  unitPriceVnd: number;
  quantity: number;
};

export type ComboPrice = {
  subtotalVnd: number;
  discountVnd: number;
  totalVnd: number;
  discountPct: number;
};

/**
 * Combo discount tiers — the more services a traveler bundles, the bigger the
 * cut versus booking each one separately. Single source of truth for the
 * "Dynamic Combo Generator" pitch: bundling is always cheaper than buying alone.
 */
function discountPctForItemCount(itemCount: number): number {
  if (itemCount >= 4) return 0.15;
  if (itemCount === 3) return 0.12;
  if (itemCount === 2) return 0.07;
  return 0;
}

export function computeComboPrice(items: PriceableItem[]): ComboPrice {
  const subtotalVnd = items.reduce((sum, i) => sum + i.unitPriceVnd * i.quantity, 0);
  const discountPct = discountPctForItemCount(items.length);
  const discountVnd = Math.round(subtotalVnd * discountPct);
  const totalVnd = subtotalVnd - discountVnd;

  return { subtotalVnd, discountVnd, totalVnd, discountPct };
}

/**
 * Pro-rates a combo's discounted total back down to each line item so
 * per-item amounts always sum exactly to `totalVnd`. Without this, an
 * OrderItem's price would still reflect the pre-discount unit price, which
 * would silently overstate every downstream commission split.
 */
export function allocateDiscountedLineTotals(items: PriceableItem[], totalVnd: number): number[] {
  const subtotalVnd = items.reduce((sum, i) => sum + i.unitPriceVnd * i.quantity, 0);
  if (subtotalVnd === 0) return items.map(() => 0);

  const amounts = items.map((i) => Math.round(((i.unitPriceVnd * i.quantity) / subtotalVnd) * totalVnd));
  const roundingRemainder = totalVnd - amounts.reduce((sum, a) => sum + a, 0);
  if (amounts.length > 0) amounts[amounts.length - 1] += roundingRemainder;

  return amounts;
}
