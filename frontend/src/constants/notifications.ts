import type { CustomerNotificationCategory } from "../types/notification.types";

/**
 * Presentation metadata for the customer notification feed.
 *
 * Order matters: it is the order the full notifications page groups entries
 * under, and the bell dropdown reads the same labels for its eyebrow text.
 * Categories the server did not return simply do not render — there is no
 * empty shell for a group with nothing behind it.
 */
export const NOTIFICATION_CATEGORY_LABELS: Record<CustomerNotificationCategory, string> = {
  orders: "Order & Shipping Updates",
  rewards: "Rewards & Loyalty",
  wishlist: "Wishlist & Stock Alerts",
  account: "Account & Reviews",
  promotions: "Promotions & Offers",
};

/** Rendering order, most transactional first. */
export const NOTIFICATION_CATEGORY_ORDER: CustomerNotificationCategory[] = [
  "orders",
  "rewards",
  "wishlist",
  "account",
  "promotions",
];

/** Hard cap for the header dropdown; the rest live on the notifications page. */
export const BELL_PREVIEW_LIMIT = 5;
