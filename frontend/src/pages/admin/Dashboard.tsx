import { memo, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import AdminLayout from "../../components/layout/AdminLayout";
import { formatCurrency } from "../../utils/formatCurrency";

// Dashboard analytics panels (charts + feeds)
import PeriodSelector, { type PeriodDays } from "../../components/admin/dashboard/PeriodSelector";
import DashboardStatCard from "../../components/admin/dashboard/DashboardStatCard";
import SalesOverview from "../../components/admin/dashboard/SalesOverview";
import TopCategories from "../../components/admin/dashboard/TopCategories";
import RecentProducts from "../../components/admin/dashboard/RecentProducts";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import TopSellingProducts from "../../components/admin/dashboard/TopSellingProducts";
import ProductDemandTrends from "../../components/admin/dashboard/ProductDemandTrends";
import AverageOrderValue from "../../components/admin/dashboard/AverageOrderValue";
import CustomerActivity from "../../components/admin/dashboard/CustomerActivity";
import {
  BagIcon,
  BoxIcon,
  CartIcon,
  PeopleIcon,
} from "../../components/admin/dashboard/icons";

// Memoized Header Component
const DashboardHeader = memo(({ period, onPeriodChange }: { period: PeriodDays; onPeriodChange: (days: PeriodDays) => void }) => (
  <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
    <div className="space-y-1.5">
      <div className="text-sm font-semibold text-brand uppercase tracking-wider">ADMINISTRATION</div>
      <h1 className="text-responsive-h2 font-bold text-gray-900">Dashboard</h1>
      <p className="text-responsive-body text-gray-600">
        Here's an overview of your store's performance and key metrics.
      </p>
    </div>
    <PeriodSelector value={period} onChange={onPeriodChange} />
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
  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ["admin", "products", "count"],
    queryFn: ({ signal }) => productService.getAll({ limit: 1 }, { signal }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

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

  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", "count"],
    queryFn: ({ signal }) => userService.getAll(1, 1, { signal }),
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

  // Newest products table - refreshed by ManageProducts invalidations too.
  const { data: recentProductsRes, isLoading: recentProductsLoading } = useQuery({
    queryKey: ["admin", "products", "recent"],
    queryFn: ({ signal }) =>
      productService.getAll({ limit: 5, sortBy: "created_at", sortOrder: "desc" }, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const totalRevenue = statsRes?.data.totalRevenue ?? 0;

  const isLoading = productsLoading || statsLoading || usersLoading || analyticsLoading;

  const productTotal = productsRes?.pagination.total ?? "—";
  const orderTotal = statsRes?.data.totalOrders ?? "—";
  const userTotal = usersRes?.pagination.total ?? "—";

  // Period series + comparison totals powering sparklines and change badges.
  const analytics = analyticsRes?.data;
  const currentPoints = analytics?.current ?? [];
  const totals = analytics?.totals;

  // Activity restricted to the selected period (defensive re-check of the
  // server-side window).
  const activity = useMemo(
    () =>
      (analytics?.recentActivity ?? []).filter(
        (item) => new Date(item.at).getTime() >= activityCutoff
      ),
    [analytics?.recentActivity, activityCutoff]
  );

  // Period-over-period totals backing the KPI comparison badges.
  const currentTotals = totals?.current;
  const previousTotals = totals?.previous;

  return (
    <AdminLayout>
      <div ref={containerRef} className="w-full px-responsive space-y-6 py-8 section-container">
        {/* Header + period selector (drives every chart below) */}
        <DashboardHeader period={period} onPeriodChange={setPeriod} />

        {/* KPI row: Total Revenue / Orders / Customers / Products */}
        {!isLoading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-responsive">
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Total Revenue"
                value={formatCurrency(totalRevenue)}
                icon={<BagIcon size={20} />}
                iconBg="from-brand to-cyan-600"
                sparkColor="#0e7c85"
                periodValue={currentTotals?.revenue ?? 0}
                previousValue={previousTotals?.revenue ?? 0}
                series={currentPoints.map((point) => point.revenue)}
                periodDays={period}
              />
            </div>
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Total Orders"
                value={orderTotal}
                icon={<CartIcon size={20} />}
                iconBg="from-brand to-brand-dark"
                sparkColor="#0e7c85"
                periodValue={currentTotals?.orders ?? 0}
                previousValue={previousTotals?.orders ?? 0}
                series={currentPoints.map((point) => point.orders)}
                periodDays={period}
              />
            </div>
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Total Customers"
                value={userTotal}
                icon={<PeopleIcon size={20} />}
                iconBg="from-brand to-cyan-700"
                sparkColor="#0b6169"
                periodValue={currentTotals?.customers ?? 0}
                previousValue={previousTotals?.customers ?? 0}
                series={currentPoints.map((point) => point.customers)}
                periodDays={period}
              />
            </div>
            <div className="animate-fade-in">
              <DashboardStatCard
                label="Total Products"
                value={productTotal}
                icon={<BoxIcon size={20} />}
                iconBg="from-amber-500 to-amber-600"
                sparkColor="#f59e0b"
                periodValue={currentTotals?.products ?? 0}
                previousValue={previousTotals?.products ?? 0}
                series={currentPoints.map((point) => point.products)}
                periodDays={period}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-responsive">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-44 rounded-2xl" />
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
            units={totals?.current.units ?? 0}
            isLoading={analyticsLoading}
          />
        </div>

        {/* Newest products table + newest orders feed */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2">
            <RecentProducts
              products={recentProductsRes?.data}
              isLoading={recentProductsLoading}
            />
          </div>
          <RecentOrders orders={recentOrdersRes?.data} isLoading={recentOrdersLoading} />
        </div>

        {/* Best sellers, daily demand and average order value */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
          <TopSellingProducts products={analytics?.topProducts ?? []} isLoading={analyticsLoading} />
          <ProductDemandTrends current={currentPoints} isLoading={analyticsLoading} />
          {totals && (
            <AverageOrderValue current={currentPoints} totals={totals} isLoading={analyticsLoading} />
          )}
        </div>

        {/* Merged order / signup / review feed */}
        <div className="max-w-7xl mx-auto animate-fade-in">
          <CustomerActivity activity={activity} isLoading={analyticsLoading} periodDays={period} />
        </div>
      </div>
    </AdminLayout>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
