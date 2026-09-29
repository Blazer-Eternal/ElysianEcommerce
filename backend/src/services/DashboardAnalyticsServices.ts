import { OrderModel } from "../models/OrderModel";
import { ProductModel } from "../models/ProductModel";
import { UserModel } from "../models/UserModel";
import { CategoryModel } from "../models/CategoryModel";
import { ReviewModel } from "../models/ReviewModel";
import { OrderStatusEnum, PaymentStatusEnum } from "../enums/OrderEnums";

// One bucket per calendar day (UTC) for the sales-overview / sparkline charts.
export interface AnalyticsPoint {
  date: string; // YYYY-MM-DD (UTC)
  revenue: number; // paid revenue captured that day
  orders: number; // orders placed that day
  paidOrders: number; // orders with payment_status = paid that day
  units: number; // units sold that day (cancelled orders excluded)
  customers: number; // users who registered that day
  products: number; // products created that day
}

export interface AnalyticsTotals {
  revenue: number;
  orders: number;
  paidOrders: number;
  units: number;
  customers: number;
  products: number;
}

export interface TopCategory {
  category_id: string | null;
  name: string;
  units: number;
  revenue: number;
}

export interface TopProduct {
  product_id: string;
  name: string | null;
  image: string | null;
  units: number;
  revenue: number;
}

export interface ActivityItem {
  id: string;
  type: "order" | "user" | "review";
  title: string;
  subtitle: string;
  at: string; // ISO date
}

export interface DashboardAnalytics {
  days: number;
  /** Daily buckets covering the selected period (zero-filled). */
  current: AnalyticsPoint[];
  /** Daily buckets covering the immediately preceding period (same length). */
  previous: AnalyticsPoint[];
  totals: { current: AnalyticsTotals; previous: AnalyticsTotals };
  topCategories: TopCategory[];
  topProducts: TopProduct[];
  recentActivity: ActivityItem[];
}

// Day key in UTC - matches $dateToString's default timezone so buckets line up
// with the aggregation output exactly.
const dayKey = (date: Date): string => date.toISOString().slice(0, 10);

const emptyTotals = (): AnalyticsTotals => ({
  revenue: 0,
  orders: 0,
  paidOrders: 0,
  units: 0,
  customers: 0,
  products: 0,
});

const emptyPoint = (date: string): AnalyticsPoint => ({
  date,
  revenue: 0,
  orders: 0,
  paidOrders: 0,
  units: 0,
  customers: 0,
  products: 0,
});

const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Dashboard analytics for the admin overview: time-series revenue/orders/
 * users/products, top categories and top products, and a merged recent
 * activity feed. Everything is aggregated inside MongoDB ($facet/$group) so
 * the client only ever receives finished series - never raw order documents.
 *
 * Exposed via GET /api/v1/orders/analytics?days=N (admin).
 */
export class DashboardAnalyticsServices {
  public async getOverview(days: number): Promise<DashboardAnalytics> {
    const windowStart = new Date();
    windowStart.setUTCHours(0, 0, 0, 0);
    // Include today: shift back (days - 1) days.
    windowStart.setUTCDate(windowStart.getUTCDate() - (days - 1));

    const currentEnd = new Date(windowStart);
    currentEnd.setUTCDate(currentEnd.getUTCDate() + days); // exclusive bound

    const previousStart = new Date(windowStart);
    previousStart.setUTCDate(previousStart.getUTCDate() - days);

    const paidCond = { $eq: ["$payment_status", PaymentStatusEnum.paid] };
    const cancelledCond = { $eq: ["$status", OrderStatusEnum.cancelled] };
    const dayExpr = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };

    const [
      byDay,
      itemBuckets,
      usersByDay,
      productsByDay,
      recentOrders,
      recentUsers,
      recentReviews,
    ] = await Promise.all([
      // Orders across both windows in one facet: per-day order counts, paid
      // revenue and units sold (cancelled orders contribute no units).
      OrderModel.aggregate([
        {
          $match: {
            created_at: { $gte: previousStart, $lt: currentEnd },
          },
        },
        {
          $facet: {
            byDay: [
              {
                $group: {
                  _id: { day: dayExpr },
                  orders: { $sum: 1 },
                  paidOrders: { $sum: { $cond: [paidCond, 1, 0] } },
                  revenue: { $sum: { $cond: [paidCond, "$total_amount", 0] } },
                  units: {
                    $sum: {
                      $cond: [
                        cancelledCond,
                        0,
                        {
                          $reduce: {
                            input: "$items.quantity",
                            initialValue: 0,
                            in: { $add: ["$$value", "$$this"] },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ]),

      // Units sold per product per day for the current period only - powers
      // Top Selling Products and Top Categories.
      OrderModel.aggregate([
        {
          $match: {
            created_at: { $gte: windowStart, $lt: currentEnd },
            status: { $ne: OrderStatusEnum.cancelled },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: { day: dayExpr, product: "$items.product_id" },
            units: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } },
          },
        },
      ]),

      UserModel.aggregate([
        { $match: { created_at: { $gte: previousStart, $lt: currentEnd } } },
        { $group: { _id: { day: dayExpr }, count: { $sum: 1 } } },
      ]),

      ProductModel.aggregate([
        { $match: { created_at: { $gte: previousStart, $lt: currentEnd } } },
        { $group: { _id: { day: dayExpr }, count: { $sum: 1 } } },
      ]),

      // Activity feed queries are bounded to the current window so the feed
      // only ever shows events inside the selected period.
      OrderModel.find({ created_at: { $gte: windowStart, $lt: currentEnd } })
        .sort({ created_at: -1 })
        .limit(10)
        .populate("user_id", "name")
        .select("order_number user_id status total_amount created_at items.product_name")
        .lean(),

      UserModel.find({ created_at: { $gte: windowStart, $lt: currentEnd } })
        .sort({ created_at: -1 })
        .limit(6)
        .select("name email created_at")
        .lean(),

      ReviewModel.find({ created_at: { $gte: windowStart, $lt: currentEnd } })
        .sort({ created_at: -1 })
        .limit(6)
        .populate("user_id", "name")
        .populate("product_id", "name")
        .select("user_id product_id rating created_at")
        .lean(),
    ]);

    // ---- Daily buckets (zero-filled) -------------------------------------

    const currentDays: string[] = [];
    const cursor = new Date(windowStart);
    for (let i = 0; i < days; i++) {
      currentDays.push(dayKey(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    const previousDays = currentDays.map((_, i) => {
      const d = new Date(windowStart);
      d.setUTCDate(d.getUTCDate() - days + i);
      return dayKey(d);
    });

    const currentMap = new Map(currentDays.map((d) => [d, emptyPoint(d)]));
    const previousMap = new Map(previousDays.map((d) => [d, emptyPoint(d)]));
    const usersByDayMap = new Map<string, number>();
    const productsByDayMap = new Map<string, number>();

    const orderDayRows: Array<{ _id: { day: string }; orders: number; paidOrders: number; revenue: number; units: number }> =
      byDay?.[0]?.byDay ?? [];
    for (const row of orderDayRows) {
      const day = row._id?.day;
      if (!day) continue;
      const target = currentMap.get(day) ?? previousMap.get(day);
      if (!target) continue;
      target.orders = row.orders ?? 0;
      target.paidOrders = row.paidOrders ?? 0;
      target.revenue = row.revenue ?? 0;
      target.units = row.units ?? 0;
    }

    for (const row of usersByDay as Array<{ _id: { day: string }; count: number }>) {
      if (row._id?.day) usersByDayMap.set(row._id.day, row.count ?? 0);
    }
    for (const row of productsByDay as Array<{ _id: { day: string }; count: number }>) {
      if (row._id?.day) productsByDayMap.set(row._id.day, row.count ?? 0);
    }
    for (const point of currentMap.values()) {
      point.customers = usersByDayMap.get(point.date) ?? 0;
      point.products = productsByDayMap.get(point.date) ?? 0;
    }
    for (const point of previousMap.values()) {
      point.customers = usersByDayMap.get(point.date) ?? 0;
      point.products = productsByDayMap.get(point.date) ?? 0;
    }

    const current = currentDays.map((d) => currentMap.get(d)!);
    const previous = previousDays.map((d) => previousMap.get(d)!);

    const sumTotals = (points: AnalyticsPoint[]): AnalyticsTotals => {
      const totals = emptyTotals();
      for (const point of points) {
        totals.revenue += point.revenue;
        totals.orders += point.orders;
        totals.paidOrders += point.paidOrders;
        totals.units += point.units;
        totals.customers += point.customers;
        totals.products += point.products;
      }
      totals.revenue = round2(totals.revenue);
      return totals;
    };

    // ---- Top products & categories ---------------------------------------

    interface ProductAgg {
      product_id: string;
      units: number;
      revenue: number;
    }
    const productTotals = new Map<string, ProductAgg>();
    for (const bucket of itemBuckets as Array<{
      _id: { day: string; product: unknown };
      units: number;
      revenue: number;
    }>) {
      const productId = String(bucket._id?.product ?? "");
      if (!productId) continue;
      const entry = productTotals.get(productId) ?? { product_id: productId, units: 0, revenue: 0 };
      entry.units += bucket.units ?? 0;
      entry.revenue += bucket.revenue ?? 0;
      productTotals.set(productId, entry);
    }

    const productIds = [...productTotals.keys()];
    const productDocs = productIds.length
      ? await ProductModel.find({ _id: { $in: productIds } })
          .select("name images category_id")
          .lean()
      : [];
    const productById = new Map(productDocs.map((doc) => [String(doc._id), doc]));

    const topProducts: TopProduct[] = [...productTotals.values()]
      .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
      .slice(0, 6)
      .map((entry) => {
        const doc = productById.get(entry.product_id);
        return {
          product_id: entry.product_id,
          name: doc?.name ?? null,
          image: doc?.images?.[0] ?? null,
          units: entry.units,
          revenue: round2(entry.revenue),
        };
      });

    // Group per-product sales by category, then resolve category names.
    const categoryAgg = new Map<string, { category_id: string | null; units: number; revenue: number }>();
    for (const entry of productTotals.values()) {
      const doc = productById.get(entry.product_id);
      const categoryId = doc?.category_id ? String(doc.category_id) : null;
      const key = categoryId ?? "uncategorized";
      const agg = categoryAgg.get(key) ?? { category_id: categoryId, units: 0, revenue: 0 };
      agg.units += entry.units;
      agg.revenue += entry.revenue;
      categoryAgg.set(key, agg);
    }
    const categoryIds = [...categoryAgg.values()].map((c) => c.category_id).filter(Boolean) as string[];
    const categoryDocs = categoryIds.length
      ? await CategoryModel.find({ _id: { $in: categoryIds } }).select("name").lean()
      : [];
    const categoryNameById = new Map(categoryDocs.map((doc) => [String(doc._id), doc.name]));

    const topCategories: TopCategory[] = [...categoryAgg.values()]
      .sort((a, b) => b.revenue - a.revenue || b.units - a.units)
      .map((entry) => ({
        category_id: entry.category_id,
        name: (entry.category_id && categoryNameById.get(entry.category_id)) || "Uncategorized",
        units: entry.units,
        revenue: round2(entry.revenue),
      }));

    // ---- Recent activity feed (orders + registrations + reviews) ---------

    const activity: ActivityItem[] = [];

    for (const order of recentOrders as any[]) {
      const customerName = order.user_id?.name ?? "Customer";
      activity.push({
        id: `order-${order._id}`,
        type: "order",
        title: customerName,
        subtitle: `Placed an order · ${order.order_number}`,
        at: new Date(order.created_at).toISOString(),
      });
    }
    for (const user of recentUsers as any[]) {
      activity.push({
        id: `user-${user._id}`,
        type: "user",
        title: user.name ?? "New customer",
        subtitle: "Registered a new account",
        at: new Date(user.created_at).toISOString(),
      });
    }
    for (const review of recentReviews as any[]) {
      const reviewer = review.user_id?.name ?? "Customer";
      const productName = review.product_id?.name ?? "a product";
      activity.push({
        id: `review-${review._id}`,
        type: "review",
        title: reviewer,
        subtitle: `Left a ${review.rating}-star review for ${productName}`,
        at: new Date(review.created_at).toISOString(),
      });
    }
    activity.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    return {
      days,
      current,
      previous,
      totals: { current: sumTotals(current), previous: sumTotals(previous) },
      topCategories,
      topProducts,
      recentActivity: activity.slice(0, 8),
    };
  }
}
