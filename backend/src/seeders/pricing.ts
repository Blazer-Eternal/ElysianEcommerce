/**
 * Tiered markdown ladder used by the seeders.
 *
 * Flat discounts look fake: a Rs. 300 snack pack and a Rs. 2,14,000 phone do
 * not get the same treatment on real storefronts. Premium items get a deeper
 * cut (13-16%), everyday items a shallow one (5-7%), with two stepping stones
 * in between so the mid-range never jumps by 4% at once.
 *
 *   price >= 1,50,000 → 16%   price >= 8,000  → 9%
 *   price >= 1,00,000 → 15%   price >= 4,000  → 7%
 *   price >= 60,000   → 14%   price >= 2,000  → 6%
 *   price >= 30,000   → 13%   everything else → 5%
 *   price >= 15,000   → 11%
 */
const DISCOUNT_TIERS: Array<[minPrice: number, percent: number]> = [
  [150000, 16],
  [100000, 15],
  [60000, 14],
  [30000, 13],
  [15000, 11],
  [8000, 9],
  [4000, 7],
  [2000, 6],
];

/** Discount percentage a product of this selling price should advertise. */
export const discountPercentFor = (price: number): number => {
  for (const [minPrice, percent] of DISCOUNT_TIERS) {
    if (price >= minPrice) return percent;
  }
  return 5;
};

/** Discount percentage implied by a price/MRP pair, as the storefront displays it (rounded). */
export const discountPercentBetween = (price: number, mrp: number): number => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

/**
 * MRP that makes the storefront show exactly `percent` off for `price`.
 *
 * Simply doing price / (1 - pct) lands on awkward numbers, so the result is
 * snapped to a readable step (Rs. 10 above Rs. 5,000) and nudged until the
 * rounded percentage the UI prints still matches the intended tier.
 */
export const mrpForDiscount = (price: number, percent: number): number => {
  const target = price / (1 - percent / 100);
  const step = price >= 5000 ? 10 : 1;
  const base = Math.round(target / step) * step;

  for (const offset of [0, -step, step, -2 * step, 2 * step, -3 * step, 3 * step]) {
    const candidate = base + offset;
    if (candidate <= price) continue;
    if (discountPercentBetween(price, candidate) === percent) return candidate;
  }

  return Math.ceil(target);
};

/** MRP for a selling price, applying the tiered discount ladder. */
export const mrpForPrice = (price: number): number =>
  mrpForDiscount(price, discountPercentFor(price));
