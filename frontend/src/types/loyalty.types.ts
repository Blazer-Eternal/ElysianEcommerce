/**
 * The loyalty payload served by `GET /loyalty`.
 *
 * The backend owns every rule (see `backend/src/services/LoyaltyServices.ts`);
 * this file only describes the shape the portal renders, so the numbers on the
 * dashboard, the loyalty page and the order list are always the server's.
 */

export type TierName = "Registered" | "Bronze" | "Gold" | "Platinum" | "Diamond";

export interface TierRequirements {
  spend: number;
  orders: number;
  activeMonths: number;
  /** Ceiling on cancelled orders, or null where the level has none. */
  returnRate: number | null;
  cycleMonths: number;
}

export interface ChecklistItem {
  key: "spend" | "orders" | "activeMonths" | "returnRate";
  label: string;
  /** Formatted target, e.g. "Rs. 30,000". */
  requirement: string;
  /** Formatted position, e.g. "Rs. 12,400". */
  current: string;
  /** 0–1 towards the requirement. */
  progress: number;
  met: boolean;
}

export interface PointsEntry {
  id: string;
  activity: string;
  date: string;
  expires_at: string | null;
  points: number;
  status: "available" | "pending" | "expired";
}

export interface OrderFlag {
  order_id: string;
  order_number: string;
  state: "counts" | "pending" | "excluded";
  label: string;
  detail: string | null;
}

export interface LoyaltySummary {
  tier: { name: TierName; index: number; pointsRate: number };
  nextTier: { name: TierName; requirements: TierRequirements } | null;
  /** What this cycle is measured against: the next level, or holding the top one. */
  target: { name: TierName; requirements: TierRequirements };
  reached_at: string | null;
  cycle: { start: string; end: string; months: number; daysLeft: number };
  counters: {
    spend: number;
    orders: number;
    activeMonths: number;
    settledOrders: number;
    cancelledOrders: number;
    returnRate: number | null;
  };
  checklist: ChecklistItem[];
  nextStep: string;
  points: {
    available: number;
    pending: number;
    expiring: { points: number; date: string } | null;
    redemptionMin: number;
    redemptionCap: number;
    validityMonths: number;
  };
  history: PointsEntry[];
  orders: OrderFlag[];
  lifetimeSpend: number;
  lifetimeOrders: number;
}
