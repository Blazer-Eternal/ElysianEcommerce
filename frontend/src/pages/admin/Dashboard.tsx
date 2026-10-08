import { memo, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import AdminLayout from "../../components/layout/AdminLayout";
import { formatCurrency } from "../../utils/formatCurrency";

// Dashboard analytics panels (charts + feeds)
import PeriodSelector, { type PeriodDays } from "../../components/admin/dashboard/PeriodSelector";
import DashboardStatCard from "../../components/admin/dashboard/DashboardStatCard";
import SalesOverview from "../../components/admin/dashboard/SalesOverview";
import TopCategories from "../../components/admin/dashboard/TopCategories";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import LowStockAlerts from "../../components/admin/dashboard/LowStockAlerts";
import TopSellingProducts from "../../components/admin/dashboard/TopSellingProducts";
import ProductDemandTrends from "../../components/admin/dashboard/ProductDemandTrends";
import CustomerActivity from "../../components/admin/dashboard/CustomerActivity";
import {
  BagIcon,
  CartIcon,
  TargetIcon,
  TrendUpIcon,
} from "../../components/admin/dashboard/icons";

/** Stock at or below this counts as a low-stock alert. */
const LOW_STOCK_THRESHOLD = 10;

// Memoized Header Component
const DashboardHeader = memo(({ period, onPeriodChange }: { period: PeriodDays; onPeriodChange: (days: PeriodDays) => void }) => (
  <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in relative z-30">
    <div className="space-y-1.5">
      <div className="text-sm font-semibold text-brand uppercase tracking-wider">ADMINISTRATION</div>
      <h1 className="text-responsive-h2 font-bold text-gray-900">Dashboard</h1>
      <p className="text-responsive-body text-gray-600">
        Sales, orders and stock for the period you select.
      </p>
    </div>
    <div className="flex flex-col items-start sm:items-end gap-3">
      <PeriodSelector value={period} onChange={onPeriodChange} />
    </div>
  </div>
));
DashboardHeader.displayName = "DashboardHeader";

// Main Dashboard Component
const Dashboard = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState<PeriodDays>(30);

  // Start of the selected period (UTC midnight, today included). The customer
  // activity feed is filtered against it so it can never show older events.
  const activityCutoff = useMemo(() => {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - (period - 1));
    return start.getTime();
  }, [period]);

  // Queries with optimized stale time
  // Backend aggregates all dashboard numbers (revenue, order count, status
  // breakdown) in a single $facet round-trip - replaces the previous pattern
  // of fetching up to 100 full order documents and summing them here. The key
  // sits under the ["admin","orders"] prefix so existing status-change
  // invalidations refresh these numbers too.
  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "orders", "stats"],
    queryFn: ({ signal }) => orderService.getStats({ signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Chart analytics for the selected period. Keyed under ["admin","orders"]
  // so status-change invalidations elsewhere refresh the charts, and polled
  // every minute so the dashboard stays live while it is open.
  const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin", "orders", "analytics", period],
    queryFn: ({ signal }) => orderService.getAnalytics(period, { signal }),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  // Newest orders feed - shares the ["admin","orders"] invalidation prefix.
  const { data: recentOrdersRes, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ["admin", "orders", "recent"],
    queryFn: ({ signal }) => orderService.getAll(1, 5, { signal }),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  // Running-out inventory: the ten lowest-stocked products, then trimmed to
  // the ones actually at/below the threshold. Keyed under ["admin","products"]
  // so stock edits in ManageProducts refresh the alerts immediately.
  const { data: lowStockRes, isLoading: lowStockLoading } = useQuery({
    queryKey: ["admin", "products", "low-stock"],
    queryFn: ({ signal }) =>
      productService.getAll({ limit: 10, sortBy: "stock", sortOrder: "asc" }, { signal }),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const lowStockProducts = useMemo(
    () =>
      (lowStockRes?.data ?? [])
        .filter((product) => product.stock <= LOW_STOCK_THRESHOLD)
        .slice(0, 5),
    [lowStockRes]
  );

  const totalRevenue = statsRes?.data.totalRevenue ?? 0;

  const isLoading = statsLoading || analyticsLoading;

  const orderTotal = statsRes?.data.totalOrders ?? ", ";
  const averageOrderValue = statsRes?.data.averageOrderValue ?? 0;

  // Daily series for the charts plus the period totals backing the KPI badges.
  const analytics = analyticsRes?.data;
  const currentPoints = analytics?.current ?? [];
  const totals = analytics?.totals;

  // Activity restricted to the selected period (defensive re-check of the
  // server-side window). Order placements are excluded: they are already
  // listed row-by-row in the Recent Orders table, so keeping them here would
  // show every recent order twice.
  const activity = useMemo(
    () =>
      (analytics?.recentActivity ?? []).filter(
        (item) => item.type !== "order" && new Date(item.at).getTime() >= activityCutoff
      ),
    [analytics?.recentActivity, activityCutoff]
  );

  // Period-over-period totals backing the KPI comparison badges.
  const currentTotals = totals?.current;
  const previousTotals = totals?.previous;

  // Conversion rate = paid orders / all orders placed inside the window.
  const rateOf = (totals?: { orders: number; paidOrders: number }) =>
    totals && totals.orders > 0 ? (totals.paidOrders / totals.orders) * 100 : 0;
  const conversionRate = rateOf(currentTotals);
  const previousConversionRate = rateOf(previousTotals);

  // Average order value inside each window (the headline uses the lifetime
  // figure the backend already aggregates).
  const periodAovOf = (totals?: { orders: number; revenue: number }) =>
    totals && totals.orders > 0 ? totals.revenue / totals.orders : 0;
  const periodAov = periodAovOf(currentTotals);
  const previousPeriodAov = periodAovOf(previousTotals);

  return (
    <AdminLayout>
      <div ref={containerRef} className="w-full px-responsive space-y-6 py-8 section-container">
        {/* Header + period selector (drives every chart below) */}
        <DashboardHeader period={period} onPeriodChange={setPeriod} />

        {/* KPI row: Total Revenue / Orders / Conversion Rate / Avg Order Value */}
        {!isLoading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-responsive">
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Total Revenue"
                value={formatCurrency(totalRevenue)}
                icon={<BagIcon size={20} />}
                iconClassName="bg-brand/10 text-brand"
                periodValue={currentTotals?.revenue ?? 0}
                previousValue={previousTotals?.revenue ?? 0}
                periodDays={period}
              />
            </div>
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Total Orders"
                value={orderTotal}
                icon={<CartIcon size={20} />}
                iconClassName="bg-cyan-100 text-cyan-700"
                periodValue={currentTotals?.orders ?? 0}
                previousValue={previousTotals?.orders ?? 0}
                periodDays={period}
              />
            </div>
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Conversion Rate"
                value={`${conversionRate.toFixed(2)}%`}
                icon={<TrendUpIcon size={20} />}
                iconClassName="bg-rose/20 text-brand"
                periodValue={Number(conversionRate.toFixed(2))}
                previousValue={Number(previousConversionRate.toFixed(2))}
                periodDays={period}
                deltaFormat="points"
              />
            </div>
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Avg Order Value"
                value={formatCurrency(averageOrderValue)}
                icon={<TargetIcon size={20} />}
                iconClassName="bg-amber-100 text-amber-700"
                periodValue={periodAov}
                previousValue={previousPeriodAov}
                periodDays={period}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-responsive">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Sales Overview (this vs last period) + category donut */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2">
            <SalesOverview
              current={currentPoints}
              previous={analytics?.previous ?? []}
              isLoading={analyticsLoading}
            />
          </div>
          <TopCategories
            categories={analytics?.topCategories ?? []}
            isLoading={analyticsLoading}
          />
        </div>

        {/* Newest orders table + running-out inventory */}
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          <RecentOrders orders={recentOrdersRes?.data} isLoading={recentOrdersLoading} />
          <LowStockAlerts products={lowStockProducts} isLoading={lowStockLoading} />
        </div>

        {/* Best sellers + daily demand */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <TopSellingProducts products={analytics?.topProducts ?? []} isLoading={analyticsLoading} />
          <ProductDemandTrends current={currentPoints} isLoading={analyticsLoading} />
        </div>

        {/* Signup / review feed (order placements live in the table above) */}
        <div className="max-w-7xl mx-auto animate-fade-in">
          <CustomerActivity activity={activity} isLoading={analyticsLoading} periodDays={period} />
        </div>
      </div>
    </AdminLayout>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
