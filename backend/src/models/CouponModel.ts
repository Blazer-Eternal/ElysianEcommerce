import { Schema, model } from "mongoose";
import { CouponInterface } from "../intefaces/CouponInterface";
import { DiscountTypeEnum } from "../enums/CouponEnums";

const CouponSchema = new Schema<CouponInterface>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount_type: {
    type: String,
    enum: Object.values(DiscountTypeEnum),
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  min_order_amount: {
    type: Number,
    default: 0,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  starts_at: {
    type: Date,
    default: null,
  },
  usage_limit: {
    type: Number,
    default: null,
  },
  used_count: {
    type: Number,
    default: 0,
  },
  max_discount: {
    type: Number,
    default: null,
  },
  per_user_limit: {
    type: Number,
    default: null,
  },
  per_user_window_days: {
    type: Number,
    default: 30,
  },
  category_scope: {
    type: [String],
    default: [],
  },
  electronics_only: {
    type: Boolean,
    default: false,
  },
  exclude_electronics: {
    type: Boolean,
    default: false,
  },
  exclude_sale_items: {
    type: Boolean,
    default: true,
  },
  min_tier: {
    type: String,
    enum: ["bronze", "gold", "platinum", "diamond", null],
    default: null,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const CouponModel = model<CouponInterface>("Coupon", CouponSchema);