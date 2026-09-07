import { Schema, model } from "mongoose";
import { ReviewInterface } from "../intefaces/ReviewInterface";

const ReviewSchema = new Schema<ReviewInterface>({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  verified_purchase: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// One review per user per product
ReviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export const ReviewModel = model<ReviewInterface>("Review", ReviewSchema);