import { OrderModel } from "../models/OrderModel";
import { ProductModel } from "../models/ProductModel";
import { UserModel } from "../models/UserModel";
import { OrderStatusEnum, PaymentStatusEnum } from "../enums/OrderEnums";

/**
 * Membership tiers, fixed cycles and loyalty points.
 *
 * This is the single implementation of the published rules. The coupon gate
 * (`CouponServices`), the customer notification feed and the loyalty endpoint
 * all call into it, so the tier a customer reads on their dashboard can never
 * disagree with the tier a coupon checks at checkout.
 *
 * The rules, in one place:
 *
 * - A tier rests on three counters inside a fixed cycle: qualifying spend,
 *   qualifying orders and active months. Bronze runs a 6-month cycle, every
 *   other tier a 12-month one.
 * - An order qualifies only once it is delivered and its 7-day return window
 *   has closed. It must be worth Rs. 1,000 or more, and at most Rs. 50,000 of
 *   it counts towards spend.
 * - Orders whose qualifying dates fall less than 14 days apart count as one
 *   order for the order requirement, while their spend still counts in full.
 *   That is what stops padding a tier with tiny back-to-back orders.
 * - Gold and above also carry a 20% ceiling on cancelled orders, but the rate
 *   is only read once four settled orders exist, so a single cancellation
 *   never costs anybody a level.
 * - Upgrades are instant and one level at a time. At a cycle's end the tier is
 *   re-read from that cycle's counters: hold it, or drop exactly one level.
 *   Counters reset with every cycle; points are never wiped.
 * - Points are separate from tier progress: earned per order at the tier rate
 *   held when the order was placed, half rate on electronics, pending until
 *   the return window closes, valid for 12 months from that day.
 *
 * Everything here is derived from order records, no stored tier, so the rules
 * can be corrected without migrating anybody's account.
 */

/* ------------------------------------------------------------------ */
/* rules                                                               */
/* ------------------------------------------------------------------ */

/** Days an order must sit delivered before it starts counting. */
export const RETURN_WINDOW_DAYS = 7;
/** Orders below this value never count: neither their spend nor their number. */
export const MIN_COUNTED_VALUE = 1_000;
/** One order can contribute at most this much spend. */
export const MAX_COUNTED_SPEND = 50_000;
/** Orders closer together than this count as a single order. */
export const ORDER_SPACING_DAYS = 14;
/** Cancellations may not exceed this share of settled orders… */
export const RETURN_RATE_CEILING = 0.2;
/** …and the rate is only read from this many settled orders upwards. */
export const RETURN_RATE_SAMPLE = 4;
/** Points this many make up the smallest redemption. */
export const POINTS_REDEMPTION_MIN = 500;
/** Points may pay for at most this share of an order. */
export const POINTS_REDEMPTION_CAP = 0.1;
/** Points expire this many months after they leave "pending". */
export const POINTS_VALIDITY_MONTHS = 12;
/** Electronics earn at half the tier rate. */
export const ELECTRONICS_MULTIPLIER = 0.5;
/** Warn this many days before points expire. */
export const POINTS_EXPIRY_WARNING_DAYS = 30;

export type TierName = "Registered" | "Bronze" | "Gold" | "Platinum" | "Diamond";

export interface TierRule {
  name: TierName;
  /** -1 is the entry stage (account with no tier); the published levels are 0-3. */
  index: number;
  /** Length of one cycle at this level. */
  cycleMonths: number;
  minSpend: number;
  minOrders: number;
  minActiveMonths: number;
  /** `null` = no cancellation ceiling at this level. */
  maxReturnRate: number | null;
  pointsRate: number;
}

/**
 * Registered is what every verified account starts at: it holds no tier, but
 * its window is the same 6 months in which Bronze must be earned, and it earns
 * points at the entry rate so the first order already pays back.
 */
export const TIERS: TierRule[] = [
  { name: "Registered", index: -1, cycleMonths: 6, minSpend: 3_000, minOrders: 2, minActiveMonths: 2, maxReturnRate: null, pointsRate: 0.005 },
  { name: "Bronze", index: 0, cycleMonths: 6, minSpend: 3_000, minOrders: 2, minActiveMonths: 2, maxReturnRate: null, pointsRate: 0.005 },
  { name: "Gold", index: 1, cycleMonths: 12, minSpend: 30_000, minOrders: 4, minActiveMonths: 3, maxReturnRate: 0.2, pointsRate: 0.01 },
  { name: "Platinum", index: 2, cycleMonths: 12, minSpend: 100_000, minOrders: 8, minActiveMonths: 5, maxReturnRate: 0.2, pointsRate: 0.015 },
  { name: "Diamond", index: 3, cycleMonths: 12, minSpend: 250_000, minOrders: 15, minActiveMonths: 8, maxReturnRate: 0.2, pointsRate: 0.02 },
];

/** The four published levels, in rail order. */
export const PUBLISHED_TIERS = TIERS.filter((tier) => tier.index >= 0);

const ruleFor = (index: number): TierRule => TIERS[Math.min(Math.max(index, -1), 3) + 1];

/* ------------------------------------------------------------------ */
/* derived shapes returned to the controller                           */
/* ------------------------------------------------------------------ */

export interface CycleWindow {
  start: string;
  end: string;
  months: number;
  daysLeft: number;
}

export interface TierRequirements {
  spend: number;
  orders: number;
  activeMonths: number;
  returnRate: number | null;
  cycleMonths: number;
}

export interface CycleCounters {
  spend: number;
  orders: number;
  activeMonths: number;
  settledOrders: number;
  cancelledOrders: number;
  returnRate: number | null;
}

export interface ChecklistItem {
  key: "spend" | "orders" | "activeMonths" | "returnRate";
  label: string;
  requirement: string;
  current: string;
  progress: number;
  met: boolean;
}

export interface PointsEntry {
  id: string;
  activity: string;
  /** ISO date the entry became (or will become) available. */
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
  /** What the current cycle is being measured against (hold, or climb). */
  target: { name: TierName; requirements: TierRequirements };
  /** The day the current level was reached; null while no level is held. */
  reached_at: string | null;
  cycle: CycleWindow;
  counters: CycleCounters;
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

/* ------------------------------------------------------------------ */
/* date + money helpers                                                */
/* ------------------------------------------------------------------ */

const DAY_MS = 86_400_000;

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date.getTime());
  const dayOfMonth = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(dayOfMonth, lastDay));
  return result;
};

/** Local calendar day number, so spacing is counted in whole days. */
const dayNumber = (date: Date): number =>
  Math.round(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / DAY_MS);

const monthKey = (date: Date): string => `${date.getFullYear()}-${date.getMonth()}`;

const money = (value: number): string => Math.round(value).toLocaleString("en-IN");

const shortDate = (date: Date): string =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ------------------------------------------------------------------ */
/* order rows                                                          */
/* ------------------------------------------------------------------ */

interface ItemRow {
  product_id: string;
  quantity: number;
  unit_price: number;
  category: string;
}

interface OrderRow {
  id: string;
  order_number: string;
  created_at: Date;
  status: OrderStatusEnum;
  payment_status: PaymentStatusEnum;
  /** Item subtotal after discounts; the number every rule below reads. */
  value: number;
  delivered_at: Date | null;
  items: ItemRow[];
}

const orderValue = (subtotal: number, discount: number): number =>
  Math.max(0, (subtotal ?? 0) - (discount ?? 0));

/** The day an order is eligible to count: delivery plus the return window. */
const qualifyingDate = (order: OrderRow): Date =>
  new Date((order.delivered_at ?? order.created_at).getTime() + RETURN_WINDOW_DAYS * DAY_MS);

const qualifies = (order: OrderRow, now: Date): boolean =>
  order.status === OrderStatusEnum.delivered &&
  order.value >= MIN_COUNTED_VALUE &&
  qualifyingDate(order) <= now;

/* ------------------------------------------------------------------ */
/* service                                                             */
/* ------------------------------------------------------------------ */

/** A delivered, past-the-window, Rs. 1,000+ order, with its grouping tag. */
interface QualifyingRow {
  row: OrderRow;
  at: Date;
  /** Orders sharing a tag sit less than 14 days apart: one order between them. */
  group: number;
}

interface Simulation {
  tier: number;
  cycleStart: Date;
  cycleEnd: Date;
  counters: CycleCounters;
  /** Every level held, in order, so points can be priced at the rate of the day. */
  timeline: Array<{ at: Date; index: number }>;
}

const countersFor = (
  qualifying: QualifyingRow[],
  rows: OrderRow[],
  start: Date,
  end: Date
): CycleCounters => {
  const from = start.getTime();
  const to = end.getTime();
  const counters: CycleCounters = {
    spend: 0,
    orders: 0,
    activeMonths: 0,
    settledOrders: 0,
    cancelledOrders: 0,
    returnRate: null,
  };
  const months = new Set<string>();
  let openGroup: number | null = null;

  for (const entry of qualifying) {
    const at = entry.at.getTime();
    if (at <= from || at >= to) continue;
    counters.spend += Math.min(entry.row.value, MAX_COUNTED_SPEND);
    if (openGroup !== entry.group) {
      counters.orders += 1;
      openGroup = entry.group;
    }
    months.add(monthKey(entry.at));
  }
  counters.activeMonths = months.size;

  for (const row of rows) {
    const placed = row.created_at.getTime();
    if (placed <= from || placed >= to) continue;
    if (row.status === OrderStatusEnum.delivered || row.status === OrderStatusEnum.cancelled) {
      counters.settledOrders += 1;
    }
    if (row.status === OrderStatusEnum.cancelled) counters.cancelledOrders += 1;
  }
  if (counters.settledOrders > 0) {
    counters.returnRate = counters.cancelledOrders / counters.settledOrders;
  }

  return counters;
};

const meets = (counters: CycleCounters, rule: TierRule): boolean => {
  if (counters.spend < rule.minSpend) return false;
  if (counters.orders < rule.minOrders) return false;
  if (counters.activeMonths < rule.minActiveMonths) return false;
  if (rule.maxReturnRate !== null && counters.settledOrders >= RETURN_RATE_SAMPLE) {
    if (counters.cancelledOrders / counters.settledOrders > rule.maxReturnRate) return false;
  }
  return true;
};

export class LoyaltyServices {
  /* ---------------------------------------------------------------- */
  /* public API                                                        */
  /* ---------------------------------------------------------------- */

  /** Tier name only; the light path the coupon gate runs at checkout. */
  public async getTierName(userId: string): Promise<TierName> {
    const rows = await this.loadOrders(userId, false);
    const anchor = await this.userAnchor(userId, rows);
    return ruleFor(this.simulate(rows, new Date(), anchor).tier).name;
  }

  /** Everything the loyalty surface shows: tier, cycle, checklist, points. */
  public async evaluate(userId: string): Promise<LoyaltySummary> {
    const now = new Date();
    const [rows, anchor] = await Promise.all([
      this.loadOrders(userId, true),
      this.userAnchor(userId),
    ]);
    const simulation = this.simulate(rows, now, anchor);
    const tier = ruleFor(simulation.tier);
    const nextTier = simulation.tier >= 3 ? null : ruleFor(simulation.tier + 1);
    const target = nextTier ?? tier;

    const counters = countersFor(this.qualifying(rows, now), rows, simulation.cycleStart, simulation.cycleEnd);
    const checklist = this.checklist(counters, target);
    const { summary: points, history } = this.pointsFor(rows, simulation, now);
    const reachedAt =
      simulation.tier < 0
        ? null
        : [...simulation.timeline].reverse().find((entry) => entry.index === simulation.tier)?.at ?? null;
    const settled = rows.filter((row) => row.status !== OrderStatusEnum.cancelled);

    return {
      tier: { name: tier.name, index: tier.index, pointsRate: tier.pointsRate },
      nextTier: nextTier ? { name: nextTier.name, requirements: requirementsOf(nextTier) } : null,
      target: { name: target.name, requirements: requirementsOf(target) },
      reached_at: reachedAt ? reachedAt.toISOString() : null,
      cycle: {
        start: simulation.cycleStart.toISOString(),
        end: simulation.cycleEnd.toISOString(),
        months: tier.cycleMonths,
        daysLeft: Math.max(0, Math.ceil((simulation.cycleEnd.getTime() - now.getTime()) / DAY_MS)),
      },
      counters,
      checklist,
      nextStep: this.nextStep(checklist, counters, target, simulation.tier >= 3),
      points,
      history,
      orders: this.flags(rows, now),
      lifetimeSpend: settled.reduce((sum, row) => sum + row.value, 0),
      lifetimeOrders: settled.length,
    };
  }

  /* ---------------------------------------------------------------- */
  /* loading                                                           */
  /* ---------------------------------------------------------------- */

  private async loadOrders(userId: string, withItems: boolean): Promise<OrderRow[]> {
    const orders = await OrderModel.find({ user_id: userId })
      .select(
        withItems
          ? "order_number created_at status payment_status subtotal discount delivered_at items.product_id items.quantity items.unit_price"
          : "order_number created_at status payment_status subtotal discount delivered_at"
      )
      .lean();

    const categories = withItems ? await this.categoriesFor(orders) : new Map<string, string>();

    return orders.map((order: any) => ({
      id: String(order._id),
      order_number: order.order_number,
      created_at: new Date(order.created_at),
      status: order.status,
      payment_status: order.payment_status,
      value: orderValue(order.subtotal, order.discount),
      // Orders delivered before this field existed fall back to their creation
      // date, so the window still runs from a date the schema really has.
      delivered_at: order.delivered_at ? new Date(order.delivered_at) : null,
      items: (order.items ?? []).map((item: any) => ({
        product_id: String(item.product_id),
        quantity: item.quantity ?? 0,
        unit_price: item.unit_price ?? 0,
        category: categories.get(String(item.product_id)) ?? "",
      })),
    }));
  }

  /** product id → category name, one read for every product ever ordered. */
  private async categoriesFor(orders: any[]): Promise<Map<string, string>> {
    const ids = [...new Set(orders.flatMap((order) => (order.items ?? []).map((item: any) => String(item.product_id))))];
    const map = new Map<string, string>();
    if (ids.length === 0) return map;

    const products = await ProductModel.find({ _id: { $in: ids } })
      .select("category_id")
      .populate("category_id", "name")
      .lean();

    for (const product of products as any[]) {
      const category = product.category_id;
      map.set(String(product._id), category && typeof category === "object" ? String(category.name ?? "") : "");
    }
    return map;
  }

  /** Cycle anchor: the day the account joined, never earlier than the data. */
  private async userAnchor(userId: string, rows?: OrderRow[]): Promise<Date> {
    const user = await UserModel.findById(userId).select("created_at").lean();
    const account = user?.created_at ? new Date(user.created_at) : null;
    if (!account) return this.anchorForFallback(rows);
    return account;
  }

  private anchorForFallback(rows: OrderRow[] = []): Date {
    const first = rows.reduce<Date | null>(
      (earliest, row) => (!earliest || row.created_at < earliest ? row.created_at : earliest),
      null
    );
    return first ?? new Date();
  }

  /* ---------------------------------------------------------------- */
  /* the cycle engine                                                  */
  /* ---------------------------------------------------------------- */

  /** Delivered, past the return window, worth Rs. 1,000+, newest tag first. */
  private qualifying(rows: OrderRow[], now: Date): QualifyingRow[] {
    const entries = rows
      .filter((row) => qualifies(row, now))
      .map((row) => ({ row, at: qualifyingDate(row), group: 0 }))
      .sort((a, b) => a.at.getTime() - b.at.getTime());

    let group = 0;
    entries.forEach((entry, index) => {
      if (index > 0) {
        const gap = dayNumber(entry.at) - dayNumber(entries[index - 1].at);
        if (gap >= ORDER_SPACING_DAYS) group += 1;
      }
      entry.group = group;
    });

    return entries;
  }

  /**
   * Replays the customer's cycles as they actually happened.
   *
   * Starts at Registered on the day the account opened, applies every
   * qualifying order in date order, opens a new cycle the moment the next
   * level's requirements are met, and at each cycle end either holds the level
   * or steps down exactly one. Stops in the cycle that is running today.
   */
  private simulate(rows: OrderRow[], now: Date, anchor: Date): Simulation {
    const qualifying = this.qualifying(rows, now);
    const timeline: Array<{ at: Date; index: number }> = [{ at: anchor, index: -1 }];

    let tier = -1;
    let start = anchor;
    let cursor = 0;
    let guard = 0;

    while (guard++ < 500) {
      const rule = ruleFor(tier);
      const end = addMonths(start, rule.cycleMonths);
      let promoted = false;

      // Orders inside this cycle, one at a time: the level is read again
      // after every order, which is what makes an upgrade instant.
      while (cursor < qualifying.length && qualifying[cursor].at < end) {
        const order = qualifying[cursor];
        cursor += 1;
        if (tier >= 3) continue;

        const windowEnd = new Date(order.at.getTime() + 1);
        const counters = countersFor(qualifying, rows, start, windowEnd);
        if (meets(counters, ruleFor(tier + 1))) {
          timeline.push({ at: order.at, index: tier + 1 });
          tier += 1;
          start = order.at;
          promoted = true;
          break;
        }
      }
      if (promoted) continue;

      if (end.getTime() > now.getTime()) break; // this cycle is still running

      // Cycle over: the counters of the cycle alone decide the level.
      const counters = countersFor(qualifying, rows, start, end);
      if (tier >= 0 && !meets(counters, ruleFor(tier))) {
        timeline.push({ at: end, index: tier - 1 });
        tier -= 1;
      } else if (tier < 0) {
        // Bronze was not reached inside its window; a fresh one opens.
        timeline.push({ at: end, index: -1 });
      }
      start = end;
    }

    const cycleStart = start;
    const cycleEnd = addMonths(cycleStart, ruleFor(tier).cycleMonths);

    return {
      tier,
      cycleStart,
      cycleEnd,
      counters: countersFor(qualifying, rows, cycleStart, cycleEnd),
      timeline,
    };
  }

  /** The level in force on a given day, for pricing points historically. */
  private tierAt(timeline: Array<{ at: Date; index: number }>, date: Date): number {
    let index = timeline[0].index;
    for (const entry of timeline) {
      if (entry.at.getTime() <= date.getTime()) index = entry.index;
      else break;
    }
    return index;
  }

  /* ---------------------------------------------------------------- */
  /* presentation                                                      */
  /* ---------------------------------------------------------------- */

  private checklist(counters: CycleCounters, target: TierRule): ChecklistItem[] {
    const ratio = (current: number, need: number) => (need <= 0 ? 1 : Math.min(1, current / need));
    const items: ChecklistItem[] = [
      {
        key: "spend",
        label: "Qualifying spend",
        requirement: `Rs. ${money(target.minSpend)}`,
        current: `Rs. ${money(counters.spend)}`,
        progress: ratio(counters.spend, target.minSpend),
        met: counters.spend >= target.minSpend,
      },
      {
        key: "orders",
        label: "Qualifying orders",
        requirement: `${target.minOrders} order${target.minOrders === 1 ? "" : "s"}`,
        current: `${counters.orders} order${counters.orders === 1 ? "" : "s"}`,
        progress: ratio(counters.orders, target.minOrders),
        met: counters.orders >= target.minOrders,
      },
      {
        key: "activeMonths",
        label: "Active months",
        requirement: `${target.minActiveMonths} month${target.minActiveMonths === 1 ? "" : "s"}`,
        current: `${counters.activeMonths} month${counters.activeMonths === 1 ? "" : "s"}`,
        progress: ratio(counters.activeMonths, target.minActiveMonths),
        met: counters.activeMonths >= target.minActiveMonths,
      },
    ];

    if (target.maxReturnRate !== null) {
      const sampled = counters.settledOrders >= RETURN_RATE_SAMPLE;
      const rate = counters.returnRate ?? 0;
      items.push({
        key: "returnRate",
        label: "Cancel rate",
        requirement: "20% or lower",
        current: sampled
          ? `${Math.round(rate * 100)}% of ${counters.settledOrders} settled orders`
          : `Not checked until ${RETURN_RATE_SAMPLE} settled orders`,
        progress: sampled ? (rate <= target.maxReturnRate ? 1 : 0) : 1,
        met: !sampled || rate <= target.maxReturnRate,
      });
    }

    return items;
  }

  private nextStep(
    checklist: ChecklistItem[],
    counters: CycleCounters,
    target: TierRule,
    holding: boolean
  ): string {
    const open = checklist.find((item) => !item.met);
    if (!open) {
      return holding
        ? `Everything for ${target.name} is met this cycle; no action needed.`
        : `${target.name} is met in full; the level applies from today.`;
    }
    switch (open.key) {
      case "spend": {
        const gap = Math.max(0, target.minSpend - counters.spend);
        return `Add Rs. ${money(gap)} of qualifying spend; you are at Rs. ${money(
          counters.spend
        )} of Rs. ${money(target.minSpend)}.`;
      }
      case "orders": {
        const left = Math.max(0, target.minOrders - counters.orders);
        return `Place ${left} more qualifying order${left === 1 ? "" : "s"} of Rs. ${money(
          MIN_COUNTED_VALUE
        )} or more. Orders less than ${ORDER_SPACING_DAYS} days apart count as one.`;
      }
      case "activeMonths": {
        const left = Math.max(0, target.minActiveMonths - counters.activeMonths);
        return `Shop in ${left} more separate month${left === 1 ? "" : "s"} this cycle; you are at ${
          counters.activeMonths
        } of ${target.minActiveMonths}.`;
      }
      default:
        return `Cancellations sit at ${Math.round(
          (counters.returnRate ?? 0) * 100
        )}% of settled orders; keep them at or below 20%.`;
    }
  }

  private flags(rows: OrderRow[], now: Date): OrderFlag[] {
    const sorted = [...rows].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    const qualifying = this.qualifying(sorted, now);
    const grouped = new Map<string, boolean>();
    qualifying.forEach((entry, index) => {
      grouped.set(entry.row.id, index > 0 && entry.group === qualifying[index - 1].group);
    });

    return sorted.map((row) => {
      if (row.status === OrderStatusEnum.cancelled) {
        return {
          order_id: row.id,
          order_number: row.order_number,
          state: "excluded" as const,
          label: "Doesn't count",
          detail: "Cancelled orders are removed from tier progress and points.",
        };
      }
      if (row.value < MIN_COUNTED_VALUE) {
        return {
          order_id: row.id,
          order_number: row.order_number,
          state: "excluded" as const,
          label: "Doesn't count",
          detail: `Qualifying orders start at Rs. ${money(MIN_COUNTED_VALUE)}. This one is ${money(row.value)}.`,
        };
      }
      if (row.status !== OrderStatusEnum.delivered) {
        return {
          order_id: row.id,
          order_number: row.order_number,
          state: "pending" as const,
          label: "Not delivered yet",
          detail: "Counts on the day it is delivered, plus the 7-day return window.",
        };
      }
      const at = qualifyingDate(row);
      if (at > now) {
        return {
          order_id: row.id,
          order_number: row.order_number,
          state: "pending" as const,
          label: `Pending until ${shortDate(at)}`,
          detail: "Delivered. It counts once the 7-day return window closes.",
        };
      }
      return {
        order_id: row.id,
        order_number: row.order_number,
        state: "counts" as const,
        label: "Counts",
        detail: grouped.get(row.id)
          ? "Spend counts in full; it sits inside 14 days of your previous order, so it adds no order."
          : null,
      };
    });
  }

  /* ---------------------------------------------------------------- */
  /* points                                                            */
  /* ---------------------------------------------------------------- */

  private pointsFor(
    rows: OrderRow[],
    simulation: Simulation,
    now: Date
  ): { summary: LoyaltySummary["points"]; history: PointsEntry[] } {
    const entries: PointsEntry[] = [];

    for (const row of rows) {
      if (row.status === OrderStatusEnum.cancelled) continue;

      const at = qualifies(row, now) ? qualifyingDate(row) : row.created_at;
      const rate = ruleFor(this.tierAt(simulation.timeline, at)).pointsRate;
      const electronics = row.items
        .filter((item) => item.category.toLowerCase().includes("electronics"))
        .reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
      const plain = Math.max(0, row.value - electronics);
      const points = Math.floor(plain * rate + electronics * rate * ELECTRONICS_MULTIPLIER);
      if (points <= 0) continue;

      const refunded = row.payment_status === "refunded";
      const availableOn = qualifies(row, now) ? qualifyingDate(row) : null;
      const expires = availableOn ? addMonths(availableOn, POINTS_VALIDITY_MONTHS) : null;
      const expired = !!expires && expires.getTime() <= now.getTime();

      if (refunded) {
        entries.push({
          id: `refund:${row.id}`,
          activity: `Refund adjustment (Order #${row.order_number})`,
          date: (availableOn ?? row.created_at).toISOString(),
          expires_at: null,
          points: -points,
          status: "available",
        });
        continue;
      }

      entries.push({
        id: `earn:${row.id}`,
        activity: `Purchase bonus (Order #${row.order_number})`,
        date: (availableOn ?? row.created_at).toISOString(),
        expires_at: expires ? expires.toISOString() : null,
        points,
        status: availableOn ? (expired ? "expired" : "available") : "pending",
      });
    }

    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const available = entries
      .filter((entry) => entry.status === "available" && entry.points > 0)
      .reduce((sum, entry) => sum + entry.points, 0);
    const pending = entries
      .filter((entry) => entry.status === "pending" && entry.points > 0)
      .reduce((sum, entry) => sum + entry.points, 0);

    const warningAt = now.getTime() + POINTS_EXPIRY_WARNING_DAYS * DAY_MS;
    const expiringEntries = entries
      .filter(
        (entry) =>
          entry.status === "available" &&
          entry.points > 0 &&
          entry.expires_at !== null &&
          new Date(entry.expires_at).getTime() <= warningAt
      )
      .sort((a, b) => new Date(a.expires_at!).getTime() - new Date(b.expires_at!).getTime());

    return {
      summary: {
        available,
        pending,
        expiring:
          expiringEntries.length > 0
            ? {
                points: expiringEntries.reduce((sum, entry) => sum + entry.points, 0),
                date: expiringEntries[0].expires_at as string,
              }
            : null,
        redemptionMin: POINTS_REDEMPTION_MIN,
        redemptionCap: POINTS_REDEMPTION_CAP,
        validityMonths: POINTS_VALIDITY_MONTHS,
      },
      history: entries.slice(0, 15),
    };
  }
}

const requirementsOf = (rule: TierRule): TierRequirements => ({
  spend: rule.minSpend,
  orders: rule.minOrders,
  activeMonths: rule.minActiveMonths,
  returnRate: rule.maxReturnRate,
  cycleMonths: rule.cycleMonths,
});
