import { Schema, model } from "mongoose";
import { WishlistInterface } from "../intefaces/WishlistInterface";

const WishlistSchema = new Schema<WishlistInterface>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// A user can wishlist a product only once
WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export const WishlistModel = model<WishlistInterface>("Wishlist", WishlistSchema);