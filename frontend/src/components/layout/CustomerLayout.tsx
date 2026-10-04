import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useCartState } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useMyOrders } from "../../hooks/useMyOrders";
import { getActiveOrders, getTotalSpent } from "../../utils/customerDashboard";
import { getTierStatus } from "../../utils/loyalty";
import {
  BagIcon,
  BellIcon,
  BoxIcon,
  CrownIcon,
  GiftIcon,
  GridIcon,
  HeartIcon,
  MapPinIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  XIcon,
} from "../icons";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: ReactNode;
  /** Element id on the dashboard to scroll to when already on `to`. */
  hash?: string;
}

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const { user } = useAuth();
  const { itemCount } = useCartState();
  const { items: wishlistItems } = useWishlist();
  const { data: ordersData } = useMyOrders();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const mainRef = useRef<HTMLElement>(null);

  const orders = ordersData?.data ?? [];
  const activeOrderCount = getActiveOrders(orders).length;
  const { tier } = getTierStatus(getTotalSpent(orders));

  // The portal scrolls its own content pane (the window itself never moves),
  // so reset it on navigation and honour `#hash` links such as Loyalty.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => clearTimeout(timer);
    }
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  const navItems: NavItem[] = [
    { label: "Overview", to: ROUTES.DASHBOARD, icon: <GridIcon size={20} /> },
    {
      label: "My Orders",
      to: ROUTES.ORDER_HISTORY,
      icon: <BoxIcon size={20} />,
      badge: activeOrderCount > 0 ? (
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
          {activeOrderCount} Active
        </span>
      ) : undefined,
    },
    {
      label: "Wishlist",
      to: ROUTES.WISHLIST,
      icon: <HeartIcon size={20} />,
      badge: wishlistItems.length > 0 ? (
        <span className="min-w-5 rounded-full bg-gray-100 px-1.5 py-0.5 text-center text-[11px] font-semibold text-gray-600">
          {wishlistItems.length}
        </span>
      ) : undefined,
    },
    { label: "Loyalty & Rewards", to: ROUTES.DASHBOARD, icon: <GiftIcon size={20} />, hash: "rewards" },
    { label: "Addresses & Cards", to: ROUTES.PROFILE, icon: <MapPinIcon size={20} /> },
    { label: "Account Settings", to: ROUTES.PROFILE, icon: <SettingsIcon size={20} /> },
  ];

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setSidebarOpen(false);
    // Already on the dashboard: scroll inside the pane instead of re-navigating
    // (a same-path link would leave the section off-screen).
    if (item.hash && location.pathname === item.to) {
      event.preventDefault();
      document.getElementById(item.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `${ROUTES.PRODUCTS}?search=${encodeURIComponent(term)}` : ROUTES.PRODUCTS);
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f9fa]">
      {/* Sidebar — fixed drawer on small screens, static column from lg up */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        {/* Portal brand */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 min-w-0" title="Back to Elysian Ecommerce">
            <img src="/logo-256.png" alt="Elysian Ecommerce" width={48} height={48} className="h-10 w-auto shrink-0 object-contain" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-gray-900">Elysian</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand">Customer Portal</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-gray-500 hover:text-gray-900"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Signed-in customer card */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-brand to-cyan-600 text-sm font-bold text-white">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                <CrownIcon size={11} />
                {tier.name} Tier
              </span>
            </div>
          </div>
        </div>

        {/* Portal navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to && (!item.hash || location.hash === `#${item.hash}`);
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={(event) => handleNavClick(event, item)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? "text-brand" : "text-gray-400"}>{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <MenuIcon size={22} />
          </button>

          <form onSubmit={handleSearch} className="relative min-w-0 flex-1 sm:max-w-md">
            <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search orders, products, invoices..."
              aria-label="Search the store"
              className="w-full rounded-xl border border-transparent bg-gray-100 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand/40 focus:bg-white focus:outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-4">
            <Link
              to={ROUTES.ORDER_HISTORY}
              aria-label="Order updates"
              className="relative text-gray-500 hover:text-brand transition-colors"
            >
              <BellIcon size={20} />
              {activeOrderCount > 0 && (
                <span className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
              )}
            </Link>

            <Link
              to={ROUTES.CART}
              aria-label={`Cart with ${itemCount} items`}
              className="relative text-gray-500 hover:text-brand transition-colors"
            >
              <BagIcon size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-1.5 min-w-4 rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-brand to-cyan-600 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden sm:inline">{firstName}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
