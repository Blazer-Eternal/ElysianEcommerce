import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

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
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-10c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm4 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-4 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const CategoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l-5.5 9h11z M17.5 13c1.93 0 3.5 1.57 3.5 3.5S19.43 20 17.5 20 14 18.43 14 16.5s1.57-3.5 3.5-3.5z M3 13.5h8v8H3z"/>
  </svg>
);

const CouponIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 7H8v2h4v-2zm6 0h-4v2h4v-2z"/>
  </svg>
);

const OrderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4h10v2H3V4zm0 6h10v2H3v-2zm0 6h10v2H3v-2zm13-5v4h4v-4h-4zm1 3h2v-1h-2v1z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 4c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm9 0c-.29 0-.62.02-.97.05 1.16.64 1.97 1.5 1.97 2.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const ReviewIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const DataTablesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-10h-2v2h2v-2zm-2 4h-2v2h2v-2zm4-4h-2v2h2v-2zm-2 4h-2v2h2v-2zm4-4h-2v2h2v-2zm-2 4h-2v2h2v-2z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Dashboard", route: ROUTES.ADMIN_DASHBOARD, icon: <DashboardIcon /> },
    { label: "Products", route: ROUTES.ADMIN_PRODUCTS, icon: <ProductIcon /> },
    { label: "Categories", route: ROUTES.ADMIN_CATEGORIES, icon: <CategoryIcon /> },
    { label: "Coupons", route: ROUTES.ADMIN_COUPONS, icon: <CouponIcon /> },
    { label: "Orders", route: ROUTES.ADMIN_ORDERS, icon: <OrderIcon /> },
    { label: "Users", route: ROUTES.ADMIN_USERS, icon: <UserIcon /> },
    { label: "Reviews", route: ROUTES.ADMIN_REVIEWS, icon: <ReviewIcon /> },
    { label: "Messages", route: ROUTES.ADMIN_MESSAGES, icon: <MessageIcon /> },
    { label: "Data Tables", route: ROUTES.ADMIN_DATA_TABLES, icon: <DataTablesIcon /> },
  ];

  return (
    <div className="flex h-screen bg-linear-to-b from-[#fdf8f0] to-white animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-linear-to-b from-white via-white to-[#fdf8f0] border-r border-[#ece1d0] shadow-xl transform transition-transform duration-300 lg:relative lg:translate-x-0 overflow-y-auto gpu-accelerate ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        {/* Sidebar Header - pinned above the nav so items never paint over it */}
        <div className="sticky top-0 z-20 bg-linear-to-r from-white to-[#fefaf3] border-b border-[#ece1d0] shadow-[0_4px_12px_-6px_rgba(61,5,12,0.12)] p-6">
          {/* Logo Section — full brand name, links back to the main site */}
          <div className="flex items-center justify-between">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3 group"
              title="Go to Elysian Ecommerce home page"
            >
              <div className="relative">
                <img
                  src="/images/Bestlogo.jpg"
                  alt="Elysian Ecommerce"
                  width={256}
                  height={256}
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-base font-bold text-brand leading-tight min-w-0 group-hover:text-brand-dark transition-colors duration-300">
                Elysian Ecommerce
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-ink/60 hover:text-ink transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="px-8 pt-6 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/65">
          Menu
        </div>
        <nav className="px-4 pb-6 space-y-1.5 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.route;
            return (
              <Link
                key={item.route}
                to={item.route}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base transition-all duration-200 group relative overflow-hidden gpu-accelerate ${
                  isActive
                    ? "bg-brand/10 hover:bg-brand/15 text-brand font-semibold before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-brand before:content-['']"
                    : "text-ink/70 font-medium hover:bg-brand/5 hover:text-brand"
                }`}
                style={{
                  animation: `fadeInLeft 0.3s ease-out ${index * 0.05}s both`,
                  transform: "translateZ(0)",
                  willChange: "background-color, transform"
                }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-brand/0 to-cyan-600/0 group-hover:from-brand/10 group-hover:to-cyan-600/10 transition-all -z-10 gpu-accelerate" style={{ transform: "translateZ(0)" }} />
                <div
                  className={`transition-colors text-2xl shrink-0 gpu-accelerate ${
                    isActive ? "text-brand" : "text-ink/50 group-hover:text-brand"
                  }`}
                  style={{ transform: "translateZ(0)" }}
                >
                  {item.icon}
                </div>
                <span
                  className={`transition-colors gpu-accelerate ${
                    isActive ? "font-semibold" : "font-medium group-hover:text-brand"
                  }`}
                  style={{ willChange: "color" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
        {/* Top Bar - only carries the mobile sidebar toggle */}
        <div className="bg-white border-b border-[#ece1d0] sticky top-0 z-40 gpu-accelerate lg:hidden" style={{ contain: "layout style paint" }}>
          <div className="flex items-center justify-between px-6 py-4 gpu-accelerate" style={{ willChange: "background-color" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="-m-2 rounded-lg p-2 text-brand hover:bg-brand/5 hover:text-brand-dark transition-colors gpu-accelerate"
              style={{ transform: "translateZ(0)" }}
            >
              <MenuIcon />
            </button>
            <div className="flex-1" />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/40 lg:hidden z-40 gpu-accelerate"
          onClick={() => setSidebarOpen(false)}
          style={{ transform: "translateZ(0)" }}
        />
      )}
    </div>
  );
};

export default AdminLayout;