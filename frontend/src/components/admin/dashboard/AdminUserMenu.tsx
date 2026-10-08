import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const StoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9 4.5 4h15L21 9M3 9h18M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/** "Super Admin" -> "SA". Falls back to a single letter for one-word names. */
const initialsOf = (name?: string): string => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Admin header avatar — initials in a crimson disc, no photo needed. Opens a
 * menu that routes to Account & Settings (the admin-only profile screen) or
 * back to the storefront, and can sign out.
 */
const AdminUserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking anywhere outside the menu or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((next) => !next)}
        aria-label="Account menu"
        aria-expanded={open}
        title={user?.name ?? "Account"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white text-[13px] font-bold tracking-wide ring-1 ring-brand/30 shadow-[0_2px_12px_rgba(61,5,12,0.14)] transition hover:bg-brand-dark"
      >
        {initialsOf(user?.name)}
      </button>

      {open && (
        <div className="absolute top-12 right-0 z-50 w-60 overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_16px_48px_rgba(61,5,12,0.18)] animate-fade-in">
          <div className="border-b border-sand bg-cream-deep/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {initialsOf(user?.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              to={ROUTES.ADMIN_ACCOUNT}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-brand/10 hover:text-brand"
            >
              <SettingsIcon />
              Account &amp; Settings
            </Link>
            <Link
              to={ROUTES.HOME}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-brand/10 hover:text-brand"
            >
              <StoreIcon />
              Back to store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserMenu;
