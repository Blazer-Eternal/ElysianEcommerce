/**
 * Loyalty rules for the customer dashboard.
 *
 * The backend keeps no separate points ledger, so the portal derives rewards
 * from what is actually verifiable in the customer's order history: their
 * spend on non-cancelled orders. Tier thresholds follow the 12-month,
 * order-capped qualifying-spend model documented on the compare-benefits
 * page; as an interim the dashboard still derives the level from lifetime
 * non-cancelled spend until the backend exposes per-order qualifying spend
 * and order counts.
 */

export interface Tier {
  name: string;
  /** Qualifying spend (rolling 12 months) required to reach this tier. */
  minSpend: number;
  /** Minimum number of delivered orders required alongside the spend. */
  minOrders: number;
  /** Points returned per rupee of qualifying spend (1 point = Rs. 1). */
  pointsRate: number;
}

/** Ordered lowest → highest; a customer holds the last tier they qualify for. */
export const TIERS: Tier[] = [
  { name: "Bronze", minSpend: 0, minOrders: 0, pointsRate: 0.005 },
  { name: "Gold", minSpend: 30_000, minOrders: 3, pointsRate: 0.01 },
  { name: "Platinum", minSpend: 100_000, minOrders: 8, pointsRate: 0.015 },
  { name: "Diamond", minSpend: 250_000, minOrders: 15, pointsRate: 0.02 },
];

/** Points earned from qualifying spend, tier rate applied, rounded down. */
export const getLoyaltyPoints = (totalSpent: number): number => {
  const spend = Math.max(0, totalSpent);
  const tier = TIERS.reduce((found, t) => (spend >= t.minSpend ? t : found), TIERS[0]);
  return Math.floor(spend * tier.pointsRate);
};

export interface TierStatus {
  tier: Tier;
  next: Tier | null;
  /** 0–1 progress towards `next` (1 when already on the top tier). */
  progress: number;
}

/** Current tier plus progress towards the next one, from qualifying spend. */
export const getTierStatus = (totalSpent: number): TierStatus => {
  const spend = Math.max(0, totalSpent);
  const index = TIERS.reduce((found, tier, i) => (spend >= tier.minSpend ? i : found), 0);
  const tier = TIERS[index];
  const next = TIERS[index + 1] ?? null;

  if (!next) return { tier, next, progress: 1 };

  const span = next.minSpend - tier.minSpend;
  const progress = span > 0 ? Math.min(1, (spend - tier.minSpend) / span) : 1;

  return { tier, next, progress };
};
