import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/images/logo.png";

// Icons
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ProductIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
  </svg>
);

const CategoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CouponIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
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

const LogoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface NavItem {
  label: string;
  route: string;
  icon: React.ReactNode;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Dashboard", route: ROUTES.ADMIN_DASHBOARD, icon: <DashboardIcon /> },
    { label: "Products", route: ROUTES.ADMIN_PRODUCTS, icon: <ProductIcon /> },
    { label: "Categories", route: ROUTES.ADMIN_CATEGORIES, icon: <CategoryIcon /> },
    { label: "Coupons", route: ROUTES.ADMIN_COUPONS, icon: <CouponIcon /> },
    { label: "Orders", route: ROUTES.ADMIN_ORDERS, icon: <OrderIcon /> },
    { label: "Users", route: ROUTES.ADMIN_USERS, icon: <UserIcon /> },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-linear-to-b from-[#eafcfd] to-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-white via-white to-[#f0f9fb] border-r border-[#e0f2f7] shadow-xl transform transition-transform duration-300 lg:relative lg:translate-x-0 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-gradient-to-r from-white to-[#f8fcfd] border-b border-[#e0f2f7] p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-3 group">
              <div className="relative">
                <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <div className="text-lg font-bold bg-linear-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                  Elysian
                </div>
                <div className="text-xs text-gray-500 font-semibold">Admin Panel</div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Admin Menu Label */}
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Menu</div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={item.route}
              to={item.route}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-linear-to-r hover:from-[#0e7c85]/5 hover:to-cyan-600/5 hover:text-[#0e7c85] transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#0e7c85]/0 to-cyan-600/0 group-hover:from-[#0e7c85]/10 group-hover:to-cyan-600/10 transition-all -z-10" />
              <div className="text-gray-500 group-hover:text-[#0e7c85] transition-colors text-2xl flex-shrink-0">
                {item.icon}
              </div>
              <span className="font-semibold text-base group-hover:text-[#0e7c85] transition-colors">{item.label}</span>
              {index === 0 && (
                <div className="ml-auto px-2 py-1 bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white text-xs font-bold rounded-full">
                  Home
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-6 h-px bg-gradient-to-r from-transparent via-[#0e7c85]/20 to-transparent" />

        {/* Sidebar Footer - User Profile & Logout */}
        <div className="px-4 py-6 space-y-4">
          {/* User Profile */}
          <div className="glass rounded-xl p-4 bg-linear-to-br from-[#0e7c85]/5 to-cyan-600/5 border border-[#0e7c85]/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-[#0e7c85] truncate">{user?.email || "admin@elysian.com"}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Role: </span>
              <span className="capitalize font-bold text-[#0e7c85]">{user?.role || "Administrator"}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold group"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>

          {/* Back to Home Link */}
          <Link
            to={ROUTES.HOME}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#0e7c85]/20 text-[#0e7c85] rounded-xl hover:bg-[#0e7c85]/5 transition-all duration-200 font-semibold text-sm"
          >
            ← Visit Website
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/50 backdrop-blur-xl border-b border-[#e0f2f7] sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#0e7c85] hover:text-[#1a6b94] transition-colors"
            >
              <MenuIcon />
            </button>
            <div className="flex-1" />
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back</p>
              <p className="text-lg font-bold text-gray-900">{user?.name?.split(" ")[0] || "Admin"}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
