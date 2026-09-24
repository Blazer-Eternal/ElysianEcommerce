import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCartState } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCartState();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // The mobile account panel renders OUTSIDE accountMenuRef, so a press on its rows used to count as an
      // "outside" click: the panel unmounted on mousedown before the click event landed, so the row links
      // never received it (why mobile account links didn't navigate). Only close when the press is outside
      // BOTH the desktop dropdown and the mobile panel - the rows close the menu themselves on click.
      const insideDropdown = accountMenuRef.current?.contains(target) ?? false;
      const insidePanel = mobilePanelRef.current?.contains(target) ?? false;
      if (!insideDropdown && !insidePanel) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate(ROUTES.HOME);
  };

  const accountMenuItems: Array<{ label: string; to?: string; action?: () => void; red?: boolean; admin?: boolean }> = [
    { label: "Your Profile", to: ROUTES.PROFILE },
    { label: "My Wishlist", to: ROUTES.WISHLIST },
    { label: "My Orders", to: ROUTES.ORDER_HISTORY },
    { label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, admin: true },
    { label: "Logout", red: true, action: handleLogout },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-40 overflow-visible animation-container gpu-accelerate" style={{ contain: "layout style", transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
      {/* No `relative` and no `contain: layout` on this box or the icons row below: either would make this centered
          box the containing block for the account dropdown. The dropdown must anchor to the full-width <nav>
          so it can sit flush at the far-right viewport edge. */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex items-center justify-between gap-2 sm:gap-3 md:gap-6 overflow-visible">
        <Link to={ROUTES.HOME} className="shrink-0 flex items-center gpu-accelerate" style={{ transform: "translateZ(0)" }}>
          <img 
            src="/logo-256.png" 
            alt="ElysianEcommerce Logo" 
            width={256}
            height={256}
            className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto object-contain transition-transform hover:scale-105"
            style={{ willChange: "transform" }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-xs sm:text-sm md:text-sm text-gray-700 absolute left-1/2 -translate-x-1/2" style={{ contain: "layout style" }}>
          <Link to={ROUTES.PRODUCTS} className="hover:accent-text transition-colors gpu-accelerate" style={{ transform: "translateZ(0)" }}>Products</Link>
          <Link to={ROUTES.FEATURES} className="hover:accent-text transition-colors gpu-accelerate" style={{ transform: "translateZ(0)" }}>Features</Link>
          <Link to={ROUTES.ABOUT} className="hover:accent-text transition-colors gpu-accelerate" style={{ transform: "translateZ(0)" }}>About</Link>
        </div>

        {/* No `contain: layout` here either - it would capture the dropdown's positioning context */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-auto overflow-visible">
          {isAuthenticated ? (
            <>
              {/* Cart Icon - badge is anchored to an icon-sized wrapper, NOT the link box (the box changes between
                  desktop 28px and mobile 44px touch rule, the icon never does). Offset makes the badge's left edge
                  overlap the icon's RIGHT EDGE by 4px and run down it - badge stays connected to the icon in every view */}
              <Link to={ROUTES.CART} aria-label="Cart" className="relative inline-flex shrink-0 w-7 h-7 items-center justify-center text-gray-700 hover:accent-text transition-colors overflow-visible">
                <span className="relative inline-flex">
                  <BagIcon />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-4 w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold bg-[#0e7c85] text-white">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </span>
              </Link>

              {/* Account Menu - Desktop and Mobile */}
              <div className="inline-flex shrink-0 overflow-visible" ref={accountMenuRef} style={{ zIndex: 50 }}>
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setMobileMenuOpen(false);
                  }}
                  aria-label="Account menu"
                  className="text-gray-700 hover:accent-text transition-colors cursor-pointer p-1 inline-flex items-center justify-center shrink-0 gpu-accelerate"
                  style={{ transform: "translateZ(0)" }}
                >
                  <UserIcon />
                </button>

                {/* Desktop Dropdown Card - anchored to the full-width nav, flush at the far-right viewport edge (20px inset).
                    Translucent white + light backdrop blur keeps it dull so it doesn't pull focus from the hero (only rendered while open). */}
                {userMenuOpen && (
                  <div className="hidden md:block absolute top-full right-5 mt-1 z-50 w-32 whitespace-nowrap rounded-lg border border-white/50 bg-white/75 shadow-md backdrop-blur-sm py-1">
                    {user?.name && (
                      <div className="px-3 py-2 border-b border-gray-100/70 text-gray-500 text-xs font-medium truncate">
                        {user.name}
                      </div>
                    )}
                    {accountMenuItems.map((item) => {
                      if (item.admin && user?.role !== "admin") return null;
                      const baseClass = `block w-full text-left px-3 py-1 text-sm transition-colors ${item.red ? "text-red-500 hover:bg-red-50/60" : "text-gray-600 hover:bg-white/90"}`;
                      const onClick = () => setUserMenuOpen(false);
                      if (item.action) {
                        return (
                          <button
                            key={item.label}
                            onClick={() => {
                              onClick();
                              item.action?.();
                            }}
                            className={baseClass}
                          >
                            {item.label}
                          </button>
                        );
                      }
                      return (
                        <Link
                          key={item.label}
                          to={item.to!}
                          onClick={onClick}
                          className={baseClass}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <Link to={ROUTES.LOGIN} className="text-xs sm:text-sm text-gray-700 hover:accent-text gpu-accelerate" style={{ transform: "translateZ(0)" }}>Login</Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-xs sm:text-sm bg-[#0e7c85] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full hover:bg-[#0b6169] transition-colors whitespace-nowrap gpu-accelerate"
                style={{ transform: "translateZ(0)" }}
              >
                Register
              </Link>
            </div>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setUserMenuOpen(false);
            }}
            aria-label="Open menu"
            className="sm:hidden shrink-0 text-gray-700 flex items-center justify-center gpu-accelerate"
            style={{ transform: "translateZ(0)" }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-strong border-t border-white/60 px-3 py-3 space-y-1 text-xs sm:text-sm animation-container gpu-accelerate" style={{ contain: "layout style paint", transform: "translateZ(0)" }}>
          <Link to={ROUTES.PRODUCTS} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#0e7c85] gpu-accelerate" style={{ transform: "translateZ(0)" }}>
            Products
          </Link>
          <Link to={ROUTES.FEATURES} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#0e7c85] gpu-accelerate" style={{ transform: "translateZ(0)" }}>
            Features
          </Link>
          <Link to={ROUTES.ABOUT} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#0e7c85] gpu-accelerate" style={{ transform: "translateZ(0)" }}>
            About
          </Link>
        </div>
      )}

      {/* Mobile Account Panel - full-width stacked rows, matches Vercel ref divider + uniform spacing */}
      {userMenuOpen && isAuthenticated && (
        <div ref={mobilePanelRef} className="sm:hidden glass-strong border-t border-white/60 px-3 py-3 text-xs sm:text-sm animation-container gpu-accelerate" style={{ contain: "layout style paint", transform: "translateZ(0)" }}>
          {/* Rows use `flex items-center min-h-[44px]` so every row is exactly 44px with a vertically centered label:
              neutralizes the touch rule's uneven effect (buttons center their label under min-height, links top-align it),
              which was making the gap above Logout visibly larger than the rest */}
          {user?.name && (
            <div className="flex items-center min-h-[44px] py-2 text-sm font-semibold text-gray-800 border-b border-gray-100 gpu-accelerate" style={{ transform: "translateZ(0)" }}>
              <span className="truncate">{user.name}</span>
            </div>
          )}
          {accountMenuItems.map((item) => {
            if (item.admin && user?.role !== "admin") return null;
            const baseClass = `flex items-center w-full min-h-[44px] text-left py-2 border-b border-gray-100 last:border-b-0 gpu-accelerate transition-colors ${item.red ? "text-red-600 hover:text-red-700" : "text-gray-700 hover:text-[#0e7c85]"}`;
            const onClick = () => setUserMenuOpen(false);
            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onClick();
                    item.action?.();
                  }}
                  className={baseClass}
                  style={{ transform: "translateZ(0)" }}
                >
                  {item.label}
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to!}
                onClick={onClick}
                className={baseClass}
                style={{ transform: "translateZ(0)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
