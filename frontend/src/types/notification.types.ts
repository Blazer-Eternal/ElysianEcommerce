export type NotificationType = "signup" | "order";

/** Admin-facing activity feed entry (new signup / new customer order). */
export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

/** GET /notifications, bell feed plus the unread badge count. */
export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
}

/* ------------------------------------------------------------------ */
/* Customer feed (derived server-side from real records)               */
/* ------------------------------------------------------------------ */

/**
 * The five customer update groups. A group is only ever present in the
 * response when the database holds data behind it. There is no placeholder
 * content for a category that currently has nothing to say.
 */
export type CustomerNotificationCategory =
  | "orders"
  | "rewards"
  | "wishlist"
  | "account"
  | "promotions";

/**
 * One derived customer update.
 *
 * `timestamp` is a real date taken from the source record, and
 * `timestampLabel` states what that date marks, the server never claims a
 * status-change time the schema does not record.
 */
export interface CustomerNotification {
  /** Deterministic identity used to persist read state. */
  key: string;
  category: CustomerNotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  timestampLabel: string;
  href: string | null;
  read: boolean;
}

/** GET /notifications/customer, full feed plus the unread badge count. */
export interface CustomerNotificationListResponse {
  success: boolean;
  data: CustomerNotification[];
  unreadCount: number;
}
