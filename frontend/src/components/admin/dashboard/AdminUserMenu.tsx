import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/**
 * Admin header avatar. Sits beside the notification bell and opens a small menu
 * whose "My Profile" action routes to the shared Your Profile page — the
 * account dropdown in the main navbar no longer carries that shortcut.
 */
const AdminUserMenu = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking anywhere outside the menu (same behaviour as the bell).
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

  return (
    <div ref={containerRef} className="relative shrink-0 self-end sm:self-auto">
      <button
        onClick={() => setOpen((next) => !next)}
        aria-label="Account menu"
        aria-expanded={open}
        title={user?.name ?? "Account"}
        className="w-11 h-11 rounded-xl glass border border-gray-200 text-gray-600 hover:text-brand hover:border-brand/40 hover:bg-white transition-all duration-200 flex items-center justify-center"
      >
        <UserIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-xl border border-gray-200 shadow-2xl animate-fade-in overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="p-2">
            <Link
              to={ROUTES.PROFILE}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-brand/10 hover:text-brand transition-colors"
            >
              <ProfileIcon />
              My Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserMenu;
