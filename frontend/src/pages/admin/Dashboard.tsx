import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import AdminNavbar from "../../components/layout/AdminNavbar";
import StatCard from "../../components/admin/StatCard";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

// Icons
const ProductIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
  </svg>
);

const OrderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.33-1.04c-.42-.32-1.02-.23-1.33.09-.32.32-.21.92.11 1.33l2.5 1.96c.46.37 1.12.37 1.58 0l3.96-5.08c.32-.41.23-1.01-.09-1.33-.32-.32-.92-.21-1.33.11l-3.15 4.05z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.48-.46-2.21-.97-2.21-2.09 0-1.38 1.03-2.24 2.64-2.24 1.04 0 2.1.35 3.2 1.03.16.09.34 0 .41-.15l.75-1.3c.05-.11.03-.24-.08-.32-1.44-.98-2.96-1.46-4.25-1.46-2.73 0-4.75 1.64-4.75 3.93 0 1.96 1.02 3.12 2.65 3.72 1.5.51 2.06 1.06 2.06 2.31 0 .85-.65 1.59-1.93 1.59-1.06 0-2.29-.4-3.39-1.14-.1-.06-.27 0-.35.11l-.57 1.51c-.04.11-.02.23.09.3 1.36.82 2.93 1.24 4.26 1.24 2.96 0 4.29-1.63 4.29-3.95 0-1.9-1.04-3.06-2.67-3.59z"/>
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: productsRes } = useQuery({
    queryKey: ["admin", "products", "count"],
    queryFn: () => productService.getAll({ limit: 1 }),
  });

  const { data: ordersRes } = useQuery({
    queryKey: ["admin", "orders", "count"],
    queryFn: () => orderService.getAll(1, 100),
  });

  const { data: usersRes } = useQuery({
    queryKey: ["admin", "users", "count"],
    queryFn: () => userService.getAll(1, 1),
  });

  const totalRevenue =
    ordersRes?.data.reduce((sum, order) => (order.payment_status === "paid" ? sum + order.total_amount : sum), 0) || 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#eafcfd] to-white">
      <AdminNavbar />
      <div className="w-full px-4 sm:px-6 space-y-8 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider">ADMINISTRATION</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-gray-600 text-lg">Manage your ElysianEcommerce store from your administration dashboard.</p>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Products" 
            value={productsRes?.pagination.total ?? "—"} 
            icon={<ProductIcon />}
            bgColor="from-[#0e7c85] to-cyan-600"
          />
          <StatCard 
            label="Total Orders" 
            value={ordersRes?.pagination.total ?? "—"} 
            icon={<OrderIcon />}
            bgColor="from-blue-500 to-blue-600"
          />
          <StatCard 
            label="Total Users" 
            value={usersRes?.pagination.total ?? "—"} 
            icon={<UserIcon />}
            bgColor="from-purple-500 to-purple-600"
          />
          <StatCard 
            label="Revenue (Paid)" 
            value={formatCurrency(totalRevenue)} 
            icon={<RevenueIcon />}
            bgColor="from-amber-500 to-amber-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to={ROUTES.ADMIN_PRODUCTS} className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/80 transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-[#0e7c85]/20 to-cyan-600/20 flex items-center justify-center text-[#0e7c85] text-xl group-hover:scale-110 transition-transform">
                  <ProductIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0e7c85] transition-colors">Manage Products</h3>
                  <p className="text-sm text-gray-600 mt-1">View, edit, delete and manage products in your collection.</p>
                </div>
              </div>
            </Link>
            <Link to={ROUTES.ADMIN_ORDERS} className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/80 transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform">
                  <OrderIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">View Orders</h3>
                  <p className="text-sm text-gray-600 mt-1">Check and update customer orders and their status.</p>
                </div>
              </div>
            </Link>
            <Link to={ROUTES.ADMIN_USERS} className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/80 transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-purple-600 text-xl group-hover:scale-110 transition-transform">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Manage Users</h3>
                  <p className="text-sm text-gray-600 mt-1">View, edit, and manage customer accounts and roles.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Admin Info Card */}
        <div className="max-w-7xl mx-auto glass rounded-2xl p-8 bg-linear-to-br from-[#0e7c85]/5 to-cyan-200/5 border-l-4 border-[#0e7c85]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Administrator Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">{user?.name || "Admin User"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">{user?.email || "admin@elysian.com"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Status</p>
              <p className="inline-block px-3 py-1 bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white text-sm font-semibold rounded-full">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
