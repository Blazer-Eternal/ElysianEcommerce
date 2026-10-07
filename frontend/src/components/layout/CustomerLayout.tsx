import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useCartState } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useMyOrders } from "../../hooks/useMyOrders";
import { useCustomerNotifications } from "../../hooks/useCustomerNotifications";
import { getActiveOrders, getTotalSpent } from "../../utils/customerDashboard";
import { getTierStatus } from "../../utils/loyalty";
import NotificationBell from "./NotificationBell";
import {
  BagIcon,
  BellIcon,
  BoxIcon,
  CrownIcon,
  CreditCardIcon,
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
  /** Numeric badge: a corner count on the rail, a chip in the drawer. */
  count?: number;
  /** Suffix for the drawer chip, e.g. the "3 Active" orders badge. */
  countSuffix?: string;
}

interface CustomerLayoutProps {
  children: ReactNode;
}

/**
 * Customer portal shell.
 *
 * Desktop navigation is a detached floating icon rail: icons only, a tooltip
 * that fades and slides in on hover, and a filled highlight on the active
 * entry. Touch devices keep a labelled drawer instead, since hover has no
 * meaning there — both read from the same `navItems` list.
 */
const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const { user } = useAuth();
  const { itemCount } = useCartState();
  const { items: wishlistItems } = useWishlist();
  const { data: ordersData } = useMyOrders();
  const { data: notificationsData } = useCustomerNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const mainRef = useRef<HTMLElement>(null);

  const orders = ordersData?.data ?? [];
  const activeOrderCount = getActiveOrders(orders).length;
  const unreadNotifications = notificationsData?.unreadCount ?? 0;
  const { tier } = getTierStatus(getTotalSpent(orders));

  // The portal scrolls its own content pane (the window itself never moves),
  // so reset it on navigation and honour `#hash` links.
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
      count: activeOrderCount,
      countSuffix: "Active",
    },
    {
      label: "Notifications",
      to: ROUTES.NOTIFICATIONS,
      icon: <BellIcon size={20} />,
      count: unreadNotifications,
      countSuffix: "New",
    },
    {
      label: "Wishlist",
      to: ROUTES.WISHLIST,
      icon: <HeartIcon size={20} />,
      count: wishlistItems.length,
    },
    { label: "Loyalty & Rewards", to: ROUTES.LOYALTY, icon: <GiftIcon size={20} /> },
    { label: "Addresses", to: ROUTES.ADDRESSES, icon: <MapPinIcon size={20} /> },
    { label: "Payment Methods", to: ROUTES.PAYMENTS, icon: <CreditCardIcon size={20} /> },
    { label: "Account Settings", to: ROUTES.PROFILE, icon: <SettingsIcon size={20} /> },
  ];

  const isActive = (item: NavItem) => location.pathname === item.to;

  const handleNavClick = () => setSidebarOpen(false);

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
    <div className="flex h-screen overflow-hidden bg-cream lg:pl-28">
      {/* Floating icon rail — desktop only */}
      <aside className="fixed bottom-4 left-4 top-4 z-40 hidden w-18 flex-col items-center rounded-3xl border border-[#ece1d0] bg-white/95 p-2 shadow-[0_6px_32px_rgba(61,5,12,0.12)] backdrop-blur-sm lg:flex">
        <Link
          to={ROUTES.HOME}
          className="group relative flex h-12 w-12 shrink-0 items-center justify-center"
          aria-label="Back to Elysian Ecommerce"
        >
          <img
            src="/images/Bestlogo.jpg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-[#ece1d0] shadow-sm"
          />
          <RailTooltip label="Back to store" />
        </Link>

        <span className="my-2 h-px w-8 shrink-0 bg-[#ece1d0]" aria-hidden />

        <nav className="flex w-full min-h-0 flex-1 flex-col items-center justify-center gap-1.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={handleNavClick}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                  active
                    ? "bg-brand text-white shadow-[0_4px_14px_rgba(61,5,12,0.3)]"
                    : "text-ink/50 hover:bg-brand/10 hover:text-brand"
                }`}
              >
                {item.icon}

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`absolute -right-1 -top-1 min-w-4 rounded-full px-1 text-center text-[10px] font-bold leading-4 ring-2 ring-white ${
                      active ? "bg-white text-brand" : "bg-brand text-white"
                    }`}
                  >
                    {item.count > 9 ? "9+" : item.count}
                  </span>
                )}

                <RailTooltip label={item.label} />
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Labelled drawer — small screens keep text, since hover does not exist */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-[#ece1d0] bg-linear-to-b from-white to-cyan-50 shadow-xl transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#ece1d0] px-5 py-4">
          <Link to={ROUTES.HOME} className="flex min-w-0 items-center gap-3" title="Back to Elysian Ecommerce">
            <img
              src="/images/Bestlogo.jpg"
              alt="Elysian Ecommerce"
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-[#ece1d0] shadow-sm"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-ink">Elysian</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                Customer Portal
              </span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="text-ink/60 transition-colors hover:text-ink"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#ece1d0] bg-cream p-3 shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-brand to-cyan-600 text-sm font-bold text-white">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">
                <CrownIcon size={11} />
                {tier.name} Tier
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={handleNavClick}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-brand/10 font-semibold text-brand before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.75 before:-translate-y-1/2 before:rounded-r-full before:bg-brand before:content-['']"
                    : "font-medium text-ink/65 hover:bg-brand/5 hover:text-brand"
                }`}
              >
                <span className={active ? "text-brand" : "text-ink/50"}>{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="min-w-5 rounded-full bg-brand px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">
                    {item.count}
                    {item.countSuffix ? ` ${item.countSuffix}` : ""}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-[#ece1d0] bg-white px-4 py-3 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="-m-1.5 rounded-lg p-1.5 text-ink/60 transition-colors hover:bg-brand/5 hover:text-brand lg:hidden"
          >
            <MenuIcon size={22} />
          </button>

          <form onSubmit={handleSearch} className="relative min-w-0 flex-1 sm:max-w-md">
            <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/50" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search orders, products, invoices..."
              aria-label="Search the store"
              className="w-full rounded-xl border border-transparent bg-cream-deep py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink/55 focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/15 focus:outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <NotificationBell />

            <Link
              to={ROUTES.CART}
              aria-label={`Cart with ${itemCount} items`}
              className="relative rounded-xl p-2 text-ink/55 transition-colors hover:bg-brand/5 hover:text-brand"
            >
              <BagIcon size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-2 text-sm font-medium text-ink/75 transition-colors hover:text-brand"
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

/**
 * Hover label for the icon rail. The outer span only positions it, the inner
 * span owns every animated property, so the fade and the slide never fight
 * over the same `translate` declaration.
 */
const RailTooltip = ({ label }: { label: string }) => (
  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap">
    <span className="block -translate-x-1 rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-[0_6px_20px_rgba(61,5,12,0.28)] transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
      {label}
    </span>
  </span>
);

export default CustomerLayout;
