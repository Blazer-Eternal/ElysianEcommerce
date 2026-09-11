import { memo, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { formatCurrency } from "../../utils/formatCurrency";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

// Memoized Icons
const ProductIcon = memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
  </svg>
));
ProductIcon.displayName = "ProductIcon";

const OrderIcon = memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.33-1.04c-.42-.32-1.02-.23-1.33.09-.32.32-.21.92.11 1.33l2.5 1.96c.46.37 1.12.37 1.58 0l3.96-5.08c.32-.41.23-1.01-.09-1.33-.32-.32-.92-.21-1.33.11l-3.15 4.05z"/>
  </svg>
));
OrderIcon.displayName = "OrderIcon";

const UserIcon = memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
));
UserIcon.displayName = "UserIcon";

const RevenueIcon = memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.48-.46-2.21-.97-2.21-2.09 0-1.38 1.03-2.24 2.64-2.24 1.04 0 2.1.35 3.2 1.03.16.09.34 0 .41-.15l.75-1.3c.05-.11.03-.24-.08-.32-1.44-.98-2.96-1.46-4.25-1.46-2.73 0-4.75 1.64-4.75 3.93 0 1.96 1.02 3.12 2.65 3.72 1.5.51 2.06 1.06 2.06 2.31 0 .85-.65 1.59-1.93 1.59-1.06 0-2.29-.4-3.39-1.14-.1-.06-.27 0-.35.11l-.57 1.51c-.04.11-.02.23.09.3 1.36.82 2.93 1.24 4.26 1.24 2.96 0 4.29-1.63 4.29-3.95 0-1.9-1.04-3.06-2.67-3.59z"/>
  </svg>
));
RevenueIcon.displayName = "RevenueIcon";

// Memoized Quick Action Card Component
const QuickActionCard = memo(({ to, icon, title, description, colorClass }: any) => (
  <Link 
    to={to} 
    className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/80 transition-smooth group cursor-pointer border border-white/20 hover-lift card-container"
  >
    <div className="flex items-start gap-4">
      <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br ${colorClass} flex items-center justify-center text-xl group-hover:scale-110 transition-transform gpu-accelerate`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#0e7c85] transition-colors">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </Link>
));
QuickActionCard.displayName = "QuickActionCard";

// Memoized Stats Summary Component
const StatsSummary = memo(({ productsTotal, ordersTotal, usersTotal, totalRevenue }: any) => (
  <div className="max-w-7xl mx-auto glass rounded-2xl p-8 bg-linear-to-br from-[#0e7c85]/5 to-cyan-200/5 border border-white/20 card-container">
    <h3 className="text-lg font-bold text-gray-900 mb-6">Store Summary</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
      <div className="animate-fade-in animation-delay-100ms">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Products</p>
        <p className="text-3xl font-bold text-[#0e7c85]">{productsTotal ?? "—"}</p>
      </div>
      <div className="animate-fade-in animation-delay-200ms">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Orders</p>
        <p className="text-3xl font-bold text-blue-600">{ordersTotal ?? "—"}</p>
      </div>
      <div className="animate-fade-in animation-delay-300ms">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Users</p>
        <p className="text-3xl font-bold text-purple-600">{usersTotal ?? "—"}</p>
      </div>
      <div className="animate-fade-in animation-delay-400ms">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Revenue</p>
        <p className="text-3xl font-bold text-amber-600">{formatCurrency(totalRevenue)}</p>
      </div>
    </div>
  </div>
));
StatsSummary.displayName = "StatsSummary";

// Memoized Header Component
const DashboardHeader = memo(() => (
  <div className="max-w-7xl mx-auto space-y-2 animate-fade-in">
    <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider">ADMINISTRATION</div>
    <h1 className="text-responsive-h2 font-bold text-gray-900">Dashboard</h1>
    <p className="text-responsive-body text-gray-600">Manage your ElysianEcommerce store from your administration dashboard.</p>
  </div>
));
DashboardHeader.displayName = "DashboardHeader";

// Memoized Stats Grid Component
const StatsGrid = memo(({ productsTotal, ordersTotal, usersTotal, totalRevenue }: any) => (
  <div className="max-w-7xl mx-auto grid-responsive-4">
    <div className="animate-fade-in animation-delay-100ms">
      <StatCard 
        label="Total Products" 
        value={productsTotal} 
        icon={<ProductIcon />}
        bgColor="from-[#0e7c85] to-cyan-600"
      />
    </div>
    <div className="animate-fade-in animation-delay-200ms">
      <StatCard 
        label="Total Orders" 
        value={ordersTotal} 
        icon={<OrderIcon />}
        bgColor="from-blue-500 to-blue-600"
      />
    </div>
    <div className="animate-fade-in animation-delay-300ms">
      <StatCard 
        label="Total Users" 
        value={usersTotal} 
        icon={<UserIcon />}
        bgColor="from-purple-500 to-purple-600"
      />
    </div>
    <div className="animate-fade-in animation-delay-400ms">
      <StatCard 
        label="Revenue (Paid)" 
        value={formatCurrency(totalRevenue)} 
        icon={<RevenueIcon />}
        bgColor="from-amber-500 to-amber-600"
      />
    </div>
  </div>
));
StatsGrid.displayName = "StatsGrid";

// Main Dashboard Component
const Dashboard = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Queries with optimized stale time
  const { data: productsRes, isLoading: productsLoading } = useQuery({
    queryKey: ["admin", "products", "count"],
    queryFn: () => productService.getAll({ limit: 1 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: ordersRes, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders", "count"],
    queryFn: () => orderService.getAll(1, 100),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", "count"],
    queryFn: () => userService.getAll(1, 1),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Memoize revenue calculation
  const totalRevenue = useMemo(() => {
    if (!ordersRes?.data) return 0;
    return ordersRes.data.reduce((sum, order) => {
      if (order.payment_status === "paid") {
        return sum + order.total_amount;
      }
      return sum;
    }, 0);
  }, [ordersRes?.data]);

  const isLoading = productsLoading || ordersLoading || usersLoading;

  const productTotal = productsRes?.pagination.total ?? "—";
  const orderTotal = ordersRes?.pagination.total ?? "—";
  const userTotal = usersRes?.pagination.total ?? "—";

  return (
    <AdminLayout>
      <div ref={containerRef} className="w-full px-responsive space-y-8 py-8 section-container">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Grid */}
        {!isLoading ? (
          <StatsGrid 
            productsTotal={productTotal}
            ordersTotal={orderTotal}
            usersTotal={userTotal}
            totalRevenue={totalRevenue}
          />
        ) : (
          <div className="max-w-7xl mx-auto grid-responsive-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto space-y-4 animate-fade-in animation-delay-300ms">
          <h2 className="text-responsive-h3 font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-responsive">
            <QuickActionCard 
              to={ROUTES.ADMIN_PRODUCTS}
              icon={<ProductIcon />}
              title="Manage Products"
              description="View, edit, delete and manage products in your collection."
              colorClass="from-[#0e7c85]/20 to-cyan-600/20"
            />
            <QuickActionCard 
              to={ROUTES.ADMIN_ORDERS}
              icon={<OrderIcon />}
              title="View Orders"
              description="Check and update customer orders and their status."
              colorClass="from-blue-500/20 to-blue-600/20"
            />
            <QuickActionCard 
              to={ROUTES.ADMIN_USERS}
              icon={<UserIcon />}
              title="Manage Users"
              description="View, edit, and manage customer accounts and roles."
              colorClass="from-purple-500/20 to-purple-600/20"
            />
          </div>
        </div>

        {/* Stats Summary */}
        {!isLoading && (
          <StatsSummary 
            productsTotal={productTotal}
            ordersTotal={orderTotal}
            usersTotal={userTotal}
            totalRevenue={totalRevenue}
          />
        )}
      </div>
    </AdminLayout>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
