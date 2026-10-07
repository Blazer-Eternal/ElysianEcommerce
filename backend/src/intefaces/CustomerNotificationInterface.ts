import { Document, Types } from "mongoose";

/**
 * The five customer-facing update groups. Each one only ever renders when the
 * database actually holds data behind it — a category with no backing records
 * is omitted from the feed entirely rather than filled with placeholder copy.
 */
export enum CustomerNotificationCategoryEnum {
  /** Orders: current status, payment state and shipment progress. */
  orders = "orders",
  /** Tier reached and the points balance derived from non-cancelled spend. */
  rewards = "rewards",
  /** Wishlist price/stock alerts plus an idle cart. */
  wishlist = "wishlist",
  /** Review requests for delivered orders that are still unreviewed. */
  account = "account",
  /** Coupons the customer is eligible for right now. */
  promotions = "promotions",
}

/**
 * One derived customer update.
 *
 * Nothing here is stored as content: the feed is rebuilt from real collections
 * on every read, so a message can only ever describe records that exist. What
 * *is* persisted is the read marker (see `CustomerNotificationReadInterface`),
 * keyed by the deterministic `key` below.
 *
 * `timestamp` is always a real date taken from the source record, and
 * `timestampLabel` states exactly what that date marks — a shipped order shows
 * the date it was *placed*, never a status-change time the database does not
 * record.
 */
export interface CustomerNotification {
  /** Deterministic identity, e.g. `order:<id>:status:shipped`, `coupon:<id>`. */
  key: string;
  category: CustomerNotificationCategoryEnum;
  title: string;
  message: string;
  timestamp: Date;
  /** Plain-language description of what `timestamp` actually marks. */
  timestampLabel: string;
  /** In-portal destination, or null for purely informational items. */
  href: string | null;
}

/** A feed entry once merged with this user's read markers. */
export interface CustomerNotificationWithRead extends CustomerNotification {
  read: boolean;
}

/** A persisted read marker: one row per (user, derived notification key). */
export interface InputCustomerNotificationReadInterface {
  user_id: Types.ObjectId;
  key: string;
}

export interface CustomerNotificationReadInterface
  extends InputCustomerNotificationReadInterface,
    Document {
  read_at: Date;
}
