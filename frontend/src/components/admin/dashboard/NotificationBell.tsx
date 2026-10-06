import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../../services/notificationService";
import type { Notification } from "../../../types/notification.types";

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SignupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const OrderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

/**
 * Admin dashboard bell. Polls GET /notifications for signup/order activity and
 * shows the unread count as a badge; opening the dropdown clears it.
 */
const NotificationBell = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: ({ signal }) => notificationService.getAll(signal),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const notifications: Notification[] = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  // Close when clicking anywhere outside the bell.
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

  const handleToggle = () => {
    const next = !open;
    setOpen(next);

    // Clearing the badge as soon as the feed is opened.
    if (next && unreadCount > 0) {
      void notificationService
        .markAllRead()
        .then(() => queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] }))
        .catch(() => {
          // Badge stays until the next successful poll, never block the UI.
        });
    }
  };

  return (
    <div ref={containerRef} className="relative shrink-0 self-end sm:self-auto">
      <button
        onClick={handleToggle}
        aria-label={`Notifications (${unreadCount} unread)`}
        title="Notifications"
        className="relative w-11 h-11 rounded-xl bg-white border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] text-gray-600 hover:text-brand hover:border-brand/40 transition-all duration-200 flex items-center justify-center"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center shadow-lg ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 max-h-[70vh] overflow-y-auto bg-white rounded-2xl border border-[#ece1d0] shadow-[0_16px_48px_rgba(61,5,12,0.18)] animate-fade-in">
          <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-[#ece1cf] bg-white rounded-t-2xl">
            <span className="font-bold text-gray-900 text-sm">Notifications</span>
            <span className="text-xs text-gray-500 font-medium">{notifications.length} recent</span>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-gray-500 text-sm">No activity yet.</p>
              <p className="text-gray-500 text-xs mt-1">Signups and new orders will show up here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#ece1cf]">
              {notifications.map((item) => (
                <li
                  key={item._id}
                  className={`flex gap-3 px-4 py-3 transition-colors ${
                    item.read ? "bg-white" : "bg-brand/5"
                  }`}
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === "signup"
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.type === "signup" ? <SignupIcon /> : <OrderIcon />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.message}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{relativeTime(item.created_at)}</p>
                  </div>
                  {!item.read && <span className="shrink-0 w-2 h-2 rounded-full bg-brand mt-1.5" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
