import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import logo from "../../assets/images/logo.png";

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AdminNavbar = () => {
  return (
    <div className="glass-nav sticky top-0 z-40 border-b border-white/60">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left - Logo */}
        <Link to={ROUTES.ADMIN_DASHBOARD} className="shrink-0 flex items-center gap-3">
          <img 
            src={logo} 
            alt="ElysianEcommerce Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900 text-sm">Admin Dashboard</p>
            <p className="text-xs text-gray-600">ElysianEcommerce</p>
          </div>
        </Link>

        {/* Right - Back to Home Button */}
        <Link 
          to={ROUTES.HOME}
          className="flex items-center gap-2 glass px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-white/80 hover:text-[#0e7c85] transition-all duration-300 group"
        >
          <HomeIcon />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Home</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminNavbar;
