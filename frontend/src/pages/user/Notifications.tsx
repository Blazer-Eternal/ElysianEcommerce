import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routes";
import {
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_ORDER,
} from "../../constants/notifications";
import {
  useCustomerNotifications,
  useMarkNotificationsRead,
} from "../../hooks/useCustomerNotifications";
import { formatDateTime } from "../../utils/formatDate";
import type {
  CustomerNotification,
  CustomerNotificationCategory,
} from "../../types/notification.types";
import {
  ArrowRightIcon,
  BellIcon,
  BoxIcon,
  CheckIcon,
  GiftIcon,
  HeartIcon,
  SparklesIcon,
  TicketIcon,
  UserIcon,
} from "../../components/icons";

const CARD = "rounded-2xl border border-[#ece1d0] bg-white p-6 shadow-[0_2px_16px_rgba(61,5,12,0.06)]";

const CATEGORY_ICON: Record<CustomerNotificationCategory, React.ReactNode> = {
  orders: <BoxIcon size={18} />,
  rewards: <GiftIcon size={18} />,
  wishlist: <HeartIcon size={18} />,
  account: <UserIcon size={18} />,
  promotions: <TicketIcon size={18} />,
};

type Filter = "all" | "unread";

const Notifications = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useCustomerNotifications();
  const markRead = useMarkNotificationsRead();
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = data?.unreadCount ?? 0;

  const grouped = useMemo(() => {
    const feed = data?.data ?? [];
    const visible = filter === "unread" ? feed.filter((entry) => !entry.read) : feed;
    const buckets = new Map<CustomerNotificationCategory, CustomerNotification[]>();
    for (const category of NOTIFICATION_CATEGORY_ORDER) buckets.set(category, []);
    for (const notification of visible) buckets.get(notification.category)?.push(notification);
    return NOTIFICATION_CATEGORY_ORDER.map((category) => ({
      category,
      items: buckets.get(category) ?? [],
    })).filter((bucket) => bucket.items.length > 0);
  }, [data, filter]);

  const openNotification = (notification: CustomerNotification) => {
    markRead.mutate([notification.key]);
    if (notification.href) navigate(notification.href);
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="py-24">
          <Spinner size="lg" />
        </div>
      </CustomerLayout>
    );
  }

  const hasUnread = unreadCount > 0;

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <section className={CARD}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <SparklesIcon size={22} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  Daily updates across your orders, rewards, wishlist and offers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl border border-[#ece1d0] bg-cream p-1">
                {(["all", "unread"] as Filter[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      filter === value
                        ? "bg-white text-brand shadow-sm"
                        : "text-ink/60 hover:text-brand"
                    }`}
                  >
                    {value}
                    {value === "unread" && hasUnread ? ` (${unreadCount})` : ""}
                  </button>
                ))}
              </div>

              {hasUnread && (
                <button
                  type="button"
                  onClick={() => markRead.mutate(null)}
                  className="rounded-xl border border-[#ece1d0] px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-brand/5"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Feed, grouped by category; empty groups never render */}
        {grouped.length === 0 ? (
          <section className={`${CARD} py-16 text-center`}>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-ink/40">
              <BellIcon size={24} />
            </span>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              {filter === "unread" ? "Nothing unread" : "No updates yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {filter === "unread"
                ? "You have read every update in your feed."
                : "Updates appear here as soon as there is something real to share: an order moving along, a price drop on a saved item, or a coupon you can use."}
            </p>
            {filter === "unread" ? (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-5 rounded-full bg-brand/10 px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
              >
                Show all updates
              </button>
            ) : (
              <Link
                to={ROUTES.PRODUCTS}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
              >
                Browse the catalog <ArrowRightIcon size={15} />
              </Link>
            )}
          </section>
        ) : (
          grouped.map(({ category, items }) => (
            <section key={category} className={CARD}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  {CATEGORY_ICON[category]}
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900">
                    {NOTIFICATION_CATEGORY_LABELS[category]}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {items.length} update{items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5">
                {items.map((notification) => (
                  <li key={notification.key}>
                    <button
                      type="button"
                      onClick={() => openNotification(notification)}
                      className={`group flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                        notification.read
                          ? "border-[#ece1d0] bg-white hover:border-brand/30 hover:bg-cream/60"
                          : "border-brand/20 bg-brand/4 hover:border-brand/35"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          notification.read ? "bg-cream text-ink/45" : "bg-brand/10 text-brand"
                        }`}
                      >
                        {CATEGORY_ICON[notification.category]}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start gap-2">
                          <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-900">
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"
                              aria-label="Unread"
                            />
                          )}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                          {notification.message}
                        </span>
                        <span className="mt-1.5 block text-xs text-gray-400">
                          {notification.timestampLabel} · {formatDateTime(notification.timestamp)}
                        </span>
                      </span>

                      {notification.href && (
                        <ArrowRightIcon
                          size={16}
                          className="mt-2 shrink-0 text-gray-300 transition-colors group-hover:text-brand"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        {/* Everything here is derived from live records, nothing is archived. */}
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
          <CheckIcon size={13} /> Updates are rebuilt from your orders, wishlist, cart and available
          offers each time you load this page.
        </p>
      </div>
    </CustomerLayout>
  );
};

export default Notifications;
