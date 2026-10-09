import { Schema, model } from "mongoose";
import { CustomerNotificationReadInterface } from "../intefaces/CustomerNotificationInterface";

/*
 * Read-state for the customer notification feed.
 *
 * The feed itself is derived live from Orders / Wishlist / Cart / Coupons /
 * Reviews on every request, so no generated copy is ever written to the
 * database. All that needs to survive between requests is *which* derived keys
 * this customer has already seen, hence this deliberately tiny marker row.
 *
 * Keys are deterministic (`order:<id>:status:shipped`, `coupon:<id>`, ...), so
 * a marker keeps meaning the same thing until the underlying record genuinely
 * changes, at which point the key changes and the update correctly reads as
 * new again.
 */
const CustomerNotificationReadSchema = new Schema<CustomerNotificationReadInterface>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  read_at: {
    type: Date,
    default: Date.now,
  },
});

// Idempotent read-marking: re-reading a key must never create a second row.
CustomerNotificationReadSchema.index({ user_id: 1, key: 1 }, { unique: true });

export const CustomerNotificationReadModel = model<CustomerNotificationReadInterface>(
  "CustomerNotificationRead",
  CustomerNotificationReadSchema
);
