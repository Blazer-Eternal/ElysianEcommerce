/**
 * The membership ladder exactly as the storefront publishes it.
 *
 * These numbers mirror `backend/src/services/LoyaltyServices.ts`, which is
 * what actually decides a customer's level. They exist so the public pages —
 * compare benefits, the plans rail, the loyalty copy — quote one set of
 * figures instead of restating them inline, and so a change to the engine has
 * exactly two places to land.
 */

/** Charged below a tier's threshold; waived from it upwards. */
export const FREE_DELIVERY_FEE = 150;

/** An order must be worth at least this much to count at all. */
export const MIN_COUNTED_ORDER = 1_000;

/** One order can contribute at most this much towards the spend requirement. */
export const MAX_COUNTED_SPEND_PER_ORDER = 50_000;

/** Orders closer together than this count as a single order. */
export const ORDER_SPACING_DAYS = 14;

/** Days after delivery before an order starts counting. */
export const RETURN_WINDOW_DAYS = 7;

export interface TierLevel {
  name: "Bronze" | "Gold" | "Platinum" | "Diamond";
  /** One cycle at this level: counters reset when it ends. */
  cycleMonths: number;
  spend: number;
  orders: number;
  activeMonths: number;
  /** Share of settled orders that may be cancelled, null = not checked. */
  returnRate: number | null;
  /** Points per rupee: 1 point is worth Rs. 1. */
  pointsRate: number;
  /** Order value from which standard delivery is free at this level. */
  freeDeliveryFrom: number;
}

export const TIER_LEVELS: TierLevel[] = [
  {
    name: "Bronze",
    cycleMonths: 6,
    spend: 3_000,
    orders: 2,
    activeMonths: 2,
    returnRate: null,
    pointsRate: 0.005,
    freeDeliveryFrom: 5_000,
  },
  {
    name: "Gold",
    cycleMonths: 12,
    spend: 30_000,
    orders: 4,
    activeMonths: 3,
    returnRate: 0.2,
    pointsRate: 0.01,
    freeDeliveryFrom: 2_000,
  },
  {
    name: "Platinum",
    cycleMonths: 12,
    spend: 100_000,
    orders: 8,
    activeMonths: 5,
    returnRate: 0.2,
    pointsRate: 0.015,
    freeDeliveryFrom: 500,
  },
  {
    name: "Diamond",
    cycleMonths: 12,
    spend: 250_000,
    orders: 15,
    activeMonths: 8,
    returnRate: 0.2,
    pointsRate: 0.02,
    freeDeliveryFrom: 500,
  },
];

/** Bronze is earned, never given at signup: these are its entry numbers. */
export const BRONZE_ENTRY = TIER_LEVELS[0];

/** Points basics published on every surface: pending, expiry, redemption. */
export const POINTS_RULES = {
  pendingDays: RETURN_WINDOW_DAYS,
  validityMonths: 12,
  redemptionMin: 500,
  redemptionCap: 0.1,
  electronicsMultiplier: 0.5,
} as const;
