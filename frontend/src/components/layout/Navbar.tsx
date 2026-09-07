import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
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
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="glass-nav sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        <Link to={ROUTES.HOME} className="font-semibold shrink-0 text-base sm:text-xl whitespace-nowrap tracking-tight">
          <span className="sm:hidden">Elysian</span>
          <span className="hidden sm:inline">ElysianEcommerce</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm text-gray-700 absolute left-1/2 -translate-x-1/2">
          <Link to={ROUTES.PRODUCTS} className="hover:accent-text transition-colors">Products</Link>
          <Link to={ROUTES.FEATURES} className="hover:accent-text transition-colors">Features</Link>
          <Link to={ROUTES.ABOUT} className="hover:accent-text transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {isAuthenticated ? (
            <>
              <div className="relative hidden sm:block" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Account menu"
                  className="block text-gray-700 hover:accent-text transition-colors"
                >
                  <UserIcon />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+12px)] w-48 glass-strong rounded-xl shadow-lg py-1.5 text-sm overflow-hidden">
                    <div className="px-3.5 py-2 border-b border-white/70 text-gray-500 text-xs">{user?.name}</div>
                    <Link to={ROUTES.PROFILE} onClick={() => setMenuOpen(false)} className="block px-3.5 py-2 hover:bg-[#eafcfd]">
                      Your Profile
                    </Link>
                    <Link to={ROUTES.WISHLIST} onClick={() => setMenuOpen(false)} className="block px-3.5 py-2 hover:bg-[#eafcfd]">
                      My Wishlist{wishlistItems.length > 0 && ` (${wishlistItems.length})`}
                    </Link>
                    <Link to={ROUTES.ORDER_HISTORY} onClick={() => setMenuOpen(false)} className="block px-3.5 py-2 hover:bg-[#eafcfd]">
                      My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMenuOpen(false)} className="block px-3.5 py-2 hover:bg-[#eafcfd]">
                        Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-[#eafcfd]">
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link to={ROUTES.CART} aria-label="Cart" className="relative text-gray-700 hover:accent-text transition-colors">
                <BagIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0e7c85] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to={ROUTES.LOGIN} className="text-sm text-gray-700 hover:accent-text">Login</Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-sm bg-[#0e7c85] text-white px-4 py-1.5 rounded-full hover:bg-[#0b6169] transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Hamburger — visible below md */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-strong border-t border-white/60 px-4 py-4 space-y-1 text-sm">
          <Link to={ROUTES.PRODUCTS} onClick={() => setMobileMenuOpen(false)} className="block py-2">
            Products
          </Link>
          <Link to={ROUTES.FEATURES} onClick={() => setMobileMenuOpen(false)} className="block py-2">
            Features
          </Link>
          <Link to={ROUTES.ABOUT} onClick={() => setMobileMenuOpen(false)} className="block py-2">
            About
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-white/60 my-2 pt-2 text-xs text-gray-500">{user?.name}</div>
              <Link to={ROUTES.PROFILE} onClick={() => setMobileMenuOpen(false)} className="block py-2">
                Your Profile
              </Link>
              <Link to={ROUTES.WISHLIST} onClick={() => setMobileMenuOpen(false)} className="block py-2">
                My Wishlist{wishlistItems.length > 0 && ` (${wishlistItems.length})`}
              </Link>
              <Link to={ROUTES.ORDER_HISTORY} onClick={() => setMobileMenuOpen(false)} className="block py-2">
                My Orders
              </Link>
              {user?.role === "admin" && (
                <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMobileMenuOpen(false)} className="block py-2">
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600">
                Logout
              </button>
            </>
          ) : (
            <div className="border-t border-white/60 mt-2 pt-2 flex flex-col gap-2">
              <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#0e7c85] text-white text-center py-2 rounded-full"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;