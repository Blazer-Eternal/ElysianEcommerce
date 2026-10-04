/**
 * Loyalty rules for the customer dashboard.
 *
 * The backend keeps no separate points ledger, so the portal derives rewards
 * from what is actually verifiable in the customer's order history: their
 * lifetime spend (orders that were not cancelled). Everything shown on the
 * dashboard — points, tier and the "next tier" progress bar — comes from
 * these two helpers, so the numbers always agree with the real orders.
 */

/** Points earned per unit of currency spent (1 point for every Rs. 2). */
export const POINTS_PER_UNIT = 2;

export interface Tier {
  name: string;
  /** Lifetime spend (non-cancelled orders) required to reach this tier. */
  minSpend: number;
}

/** Ordered lowest → highest; a customer holds the last tier they qualify for. */
export const TIERS: Tier[] = [
  { name: "Bronze", minSpend: 0 },
  { name: "Gold", minSpend: 50_000 },
  { name: "Platinum", minSpend: 150_000 },
  { name: "Diamond", minSpend: 400_000 },
];

/** Lifetime points from lifetime spend, rounded down. */
export const getLoyaltyPoints = (totalSpent: number): number =>
  Math.floor(Math.max(0, totalSpent) / POINTS_PER_UNIT);

export interface TierStatus {
  tier: Tier;
  next: Tier | null;
  /** 0–1 progress towards `next` (1 when already on the top tier). */
  progress: number;
}

/** Current tier plus progress towards the next one, from lifetime spend. */
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
