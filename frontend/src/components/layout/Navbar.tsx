import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCartState } from "../../hooks/useCart";
import { useIsAdmin } from "../../hooks/useIsAdmin";
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
  const isAdmin = useIsAdmin();
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

  // The account menu is deliberately minimal, Dashboard and Logout only, for
  // every role. Profile / Wishlist / Orders live inside the customer portal,
  // and the admin's profile shortcut lives next to the notification bell on
  // the admin dashboard, so nothing else belongs in this dropdown.
  const accountMenuItems: Array<{ label: string; to?: string; action?: () => void; red?: boolean }> = [
    {
      label: "Dashboard",
      to: user?.role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD,
    },
    { label: "Logout", red: true, action: handleLogout },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-40 overflow-visible animation-container gpu-accelerate" style={{ contain: "layout style", transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
      {/* No `relative` and no `contain: layout` on this box or the icons row below: either would make this centered
          box the containing block for the account dropdown. The dropdown must anchor to the full-width <nav>
          so it can sit flush at the far-right viewport edge. */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex items-center justify-between gap-2 sm:gap-3 md:gap-6 overflow-visible">
        <Link to={ROUTES.HOME} className="shrink-0 flex items-center gap-2 sm:gap-2.5 gpu-accelerate group" style={{ transform: "translateZ(0)" }}>
          <img 
            src="/images/Bestlogo-transparent.png" 
            alt="ElysianEcommerce Logo" 
            width={256}
            height={256}
            className="h-10 sm:h-12 md:h-14 w-10 sm:w-12 md:w-14 object-contain transition-transform group-hover:scale-105"
            style={{ willChange: "transform" }}
          />
          <span className="hidden sm:flex flex-col leading-none pb-0.5">
            <span className="font-display text-lg md:text-xl lg:text-[1.4rem] font-semibold tracking-tight text-ink">
              Elysian
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-gold-dark font-medium">
              Store
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-xs sm:text-sm md:text-sm text-ink/70 absolute left-1/2 -translate-x-1/2" style={{ contain: "layout style" }}>
          <Link to={ROUTES.PRODUCTS} className="hover:accent-text transition-colors gpu-accelerate relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full" style={{ transform: "translateZ(0)" }}>Products</Link>
          <Link to={ROUTES.FEATURES} className="hover:accent-text transition-colors gpu-accelerate relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full" style={{ transform: "translateZ(0)" }}>Features</Link>
          <Link to={ROUTES.ABOUT} className="hover:accent-text transition-colors gpu-accelerate relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full" style={{ transform: "translateZ(0)" }}>About</Link>
        </div>

        {/* No `contain: layout` here either - it would capture the dropdown's positioning context */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-auto overflow-visible">
          {isAuthenticated ? (
            <>
              {/* Cart Icon, hidden for admins who never shop. Badge is anchored to an icon-sized wrapper, NOT the link box (the box changes between
                  desktop 28px and mobile 44px touch rule, the icon never does). Offset makes the badge's left edge
                  overlap the icon's RIGHT EDGE by 4px and run down it - badge stays connected to the icon in every view */}
              {!isAdmin && (
                <Link to={ROUTES.CART} aria-label="Cart" className="relative inline-flex shrink-0 w-7 h-7 items-center justify-center text-ink/75 hover:accent-text transition-colors overflow-visible">
                  <span className="relative inline-flex">
                    <BagIcon />
                    {itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-4 w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold bg-brand text-white ring-2 ring-cream">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </span>
                </Link>
              )}

              {/* Account Menu - Desktop and Mobile */}
              <div className="inline-flex shrink-0 overflow-visible" ref={accountMenuRef} style={{ zIndex: 50 }}>
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setMobileMenuOpen(false);
                  }}
                  aria-label="Account menu"
                  className="text-ink/75 hover:accent-text transition-colors cursor-pointer p-1 inline-flex items-center justify-center shrink-0 gpu-accelerate"
                  style={{ transform: "translateZ(0)" }}
                >
                  <UserIcon />
                </button>

                {/* Desktop Dropdown Card - anchored to the full-width nav, flush at the far-right viewport edge (20px inset).
                    Translucent white + light backdrop blur keeps it dull so it doesn't pull focus from the hero (only rendered while open). */}
                {userMenuOpen && (
                  <div className="hidden md:block absolute top-full right-5 mt-2 z-50 w-40 whitespace-nowrap rounded-xl border border-sand bg-white/95 backdrop-blur-md shadow-[0_18px_40px_-18px_rgba(61,5,12,0.35)] py-1.5">
                    {accountMenuItems.map((item) => {
                      const baseClass = `block w-full text-left px-3 py-1.5 text-sm transition-colors rounded-lg ${item.red ? "text-brand hover:bg-teal-50" : "text-ink/75 hover:bg-cream-deep hover:text-ink"}`;
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
              <Link to={ROUTES.LOGIN} className="text-xs sm:text-sm text-ink/75 hover:accent-text gpu-accelerate" style={{ transform: "translateZ(0)" }}>Login</Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-xs sm:text-sm font-medium bg-brand text-white px-3.5 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-brand-dark shadow-[0_8px_20px_-10px_rgba(192,30,46,0.9)] transition-all whitespace-nowrap gpu-accelerate"
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
            className="sm:hidden shrink-0 text-ink/75 flex items-center justify-center gpu-accelerate"
            style={{ transform: "translateZ(0)" }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-strong border-t border-sand px-3 py-3 space-y-1 text-xs sm:text-sm animation-container gpu-accelerate" style={{ contain: "layout style paint", transform: "translateZ(0)" }}>
          <Link to={ROUTES.PRODUCTS} onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-sand/60 hover:text-brand gpu-accelerate" style={{ transform: "translateZ(0)" }}>
            Products
          </Link>
          <Link to={ROUTES.FEATURES} onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-sand/60 hover:text-brand gpu-accelerate" style={{ transform: "translateZ(0)" }}>
            Features
          </Link>
          <Link to={ROUTES.ABOUT} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-brand gpu-accelerate" style={{ transform: "translateZ(0)" }}>
            About
          </Link>
        </div>
      )}

      {/* Mobile Account Panel - full-width stacked rows, matches Vercel ref divider + uniform spacing */}
      {userMenuOpen && isAuthenticated && (
        <div ref={mobilePanelRef} className="sm:hidden glass-strong border-t border-sand px-3 py-3 text-xs sm:text-sm animation-container gpu-accelerate" style={{ contain: "layout style paint", transform: "translateZ(0)" }}>
          {/* Rows use `flex items-center min-h-[44px]` so every row is exactly 44px with a vertically centered label:
              neutralizes the touch rule's uneven effect (buttons center their label under min-height, links top-align it),
              which was making the gap above Logout visibly larger than the rest */}
          {accountMenuItems.map((item) => {
            const baseClass = `flex items-center w-full min-h-[44px] text-left py-2 border-b border-sand/70 last:border-b-0 gpu-accelerate transition-colors ${item.red ? "text-brand hover:text-brand-dark" : "text-ink/80 hover:text-brand"}`;
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
