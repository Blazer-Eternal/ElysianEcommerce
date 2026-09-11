import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";
import logo from "../../assets/images/logo.png";

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
    <nav className="glass-nav sticky top-0 z-40 overflow-visible">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex items-center justify-between gap-2 sm:gap-3 md:gap-6 overflow-visible">
        <Link to={ROUTES.HOME} className="shrink-0 flex items-center">
          <img 
            src={logo} 
            alt="ElysianEcommerce Logo" 
            className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-xs sm:text-sm md:text-sm text-gray-700 absolute left-1/2 -translate-x-1/2">
          <Link to={ROUTES.PRODUCTS} className="hover:accent-text transition-colors">Products</Link>
          <Link to={ROUTES.FEATURES} className="hover:accent-text transition-colors">Features</Link>
          <Link to={ROUTES.ABOUT} className="hover:accent-text transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-auto" ref={menuRef}>
          {isAuthenticated ? (
            <>
              {/* Cart Icon - visible on all authenticated screens */}
              <Link to={ROUTES.CART} aria-label="Cart" className="relative text-gray-700 hover:accent-text transition-colors flex items-center justify-center">
                <BagIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0e7c85] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Profile Icon - visible on all authenticated screens */}
              <div className="relative sm:relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Account menu"
                  className="text-gray-700 hover:accent-text transition-colors cursor-pointer p-1 flex items-center justify-center"
                >
                  <UserIcon />
                </button>

                {/* DROPDOWN MENU - Desktop: small fixed dropdown | Mobile: full-width panel */}
                {menuOpen && (
                  <>
                    {/* Desktop dropdown - fixed position */}
                    <div className="hidden sm:block fixed right-4 top-16 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 text-gray-600 text-xs font-semibold truncate">{user?.name}</div>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(ROUTES.PROFILE);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm hover:text-[#0e7c85]"
                      >
                        Your Profile
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(ROUTES.WISHLIST);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm hover:text-[#0e7c85]"
                      >
                        My Wishlist
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(ROUTES.ORDER_HISTORY);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm hover:text-[#0e7c85]"
                      >
                        My Orders
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            navigate(ROUTES.ADMIN_DASHBOARD);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 text-sm border-t border-gray-200 hover:text-[#0e7c85]"
                        >
                          Dashboard
                        </button>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm border-t border-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <Link to={ROUTES.LOGIN} className="text-xs sm:text-sm text-gray-700 hover:accent-text">Login</Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-xs sm:text-sm bg-[#0e7c85] text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full hover:bg-[#0b6169] transition-colors whitespace-nowrap"
              >
                Register
              </Link>
            </div>
          )}

          {/* Hamburger — visible below sm */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
            className="sm:hidden text-gray-700 flex items-center justify-center"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile User Dropdown Panel */}
      {menuOpen && isAuthenticated && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 text-gray-600 text-sm font-semibold">{user?.name}</div>
          <Link to={ROUTES.PROFILE} onClick={() => setMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-50 text-gray-700 text-sm hover:text-[#0e7c85] border-b border-gray-100">
            Your Profile
          </Link>
          <Link to={ROUTES.WISHLIST} onClick={() => setMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-50 text-gray-700 text-sm hover:text-[#0e7c85] border-b border-gray-100">
            My Wishlist
          </Link>
          <Link to={ROUTES.ORDER_HISTORY} onClick={() => setMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-50 text-gray-700 text-sm hover:text-[#0e7c85] border-b border-gray-100">
            My Orders
          </Link>
          {user?.role === "admin" && (
            <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-50 text-gray-700 text-sm hover:text-[#0e7c85] border-b border-gray-100">
              Dashboard
            </Link>
          )}
          <button 
            onClick={handleLogout} 
            className="w-full py-3 px-4 text-red-600 hover:bg-red-50 transition-colors text-sm text-left"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile dropdown panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-strong border-t border-white/60 px-3 py-3 space-y-1 text-xs sm:text-sm">
          <Link to={ROUTES.PRODUCTS} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#0e7c85]">
            Products
          </Link>
          <Link to={ROUTES.FEATURES} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#0e7c85]">
            Features
          </Link>
          <Link to={ROUTES.ABOUT} onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#0e7c85]">
            About
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
