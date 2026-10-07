import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  BELL_PREVIEW_LIMIT,
  NOTIFICATION_CATEGORY_LABELS,
} from "../../constants/notifications";
import {
  useCustomerNotifications,
  useMarkNotificationsRead,
} from "../../hooks/useCustomerNotifications";
import { formatDateTime } from "../../utils/formatDate";
import type { CustomerNotificationCategory } from "../../types/notification.types";
import { ArrowRightIcon, BellIcon, BoxIcon, CheckIcon, GiftIcon, HeartIcon, TicketIcon, UserIcon } from "../icons";

/** One glyph per category so the eye can scan the list without reading it. */
const CATEGORY_ICON: Record<CustomerNotificationCategory, ReactNode> = {
  orders: <BoxIcon size={16} />,
  rewards: <GiftIcon size={16} />,
  wishlist: <HeartIcon size={16} />,
  account: <UserIcon size={16} />,
  promotions: <TicketIcon size={16} />,
};

/**
 * Header notification bell.
 *
 * Opens a dropdown capped at `BELL_PREVIEW_LIMIT` entries rather than
 * navigating away — the order/tracking centre has its own nav entry. The footer
 * button is the only route out, to the full Notifications page.
 */
const NotificationBell = () => {
  const navigate = useNavigate();
  const { data } = useCustomerNotifications();
  const markRead = useMarkNotificationsRead();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const preview = notifications.slice(0, BELL_PREVIEW_LIMIT);

  // Close on outside click or Escape so the panel never traps the pointer.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleOpenNotification = (key: string, href: string | null) => {
    setOpen(false);
    // Persisted per-key so the badge counts only what has actually been seen.
    markRead.mutate([key]);
    if (href) navigate(href);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative rounded-xl p-2 transition-colors ${
          open ? "bg-brand/10 text-brand" : "text-ink/55 hover:bg-brand/5 hover:text-brand"
        }`}
      >
        <BellIcon size={20} />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white"
            aria-hidden
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#ece1d0] bg-white shadow-[0_12px_40px_rgba(61,5,12,0.16)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#ece1d0] bg-cream/60 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">Notifications</p>
              <p className="text-[11px] text-ink/55">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "You are all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markRead.mutate(null)}
                className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-brand transition-colors hover:bg-brand/10"
              >
                Mark all read
              </button>
            )}
          </div>

          {preview.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink/40">
                <BellIcon size={18} />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">No updates yet</p>
              <p className="mt-1 text-xs text-ink/55">
                Order, rewards and stock updates appear here as they happen.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] divide-y divide-cream-deep overflow-y-auto">
              {preview.map((notification) => (
                <li key={notification.key}>
                  <button
                    type="button"
                    onClick={() => handleOpenNotification(notification.key, notification.href)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream/70 ${
                      notification.read ? "" : "bg-brand/3.5"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        notification.read ? "bg-cream text-ink/45" : "bg-brand/10 text-brand"
                      }`}
                    >
                      {CATEGORY_ICON[notification.category]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start gap-2">
                        <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-ink">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink/65">
                        {notification.message}
                      </span>
                      <span className="mt-1 block text-[11px] text-ink/45">
                        {NOTIFICATION_CATEGORY_LABELS[notification.category]} ·{" "}
                        {formatDateTime(notification.timestamp)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Link
            to={ROUTES.NOTIFICATIONS}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 border-t border-[#ece1d0] bg-cream/60 px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon size={15} />
              View all daily updates
            </span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
