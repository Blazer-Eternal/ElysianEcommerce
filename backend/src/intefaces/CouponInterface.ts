import { Document } from "mongoose";
import { DiscountTypeEnum } from "../enums/CouponEnums";

export interface InputCouponInterface {
  code: string;
  discount_type: DiscountTypeEnum;
  value: number;
  min_order_amount?: number;
  expiry_date: Date;
  starts_at?: Date | null;
  usage_limit?: number | null;
  is_active?: boolean;
  /** Ceiling on the discount amount a percentage/fixed coupon can give. */
  max_discount?: number | null;
  /** Max redemptions per account inside `per_user_window_days`. */
  per_user_limit?: number | null;
  per_user_window_days?: number;
  /** Category names the coupon applies to; empty/absent means every category. */
  category_scope?: string[];
  /** True for the fixed-amount coupons that cover electronics only. */
  electronics_only?: boolean;
  /** Exclude electronics from this coupon entirely (used by SAVE500). */
  exclude_electronics?: boolean;
  /** Exclude items currently priced below their MRP (sale items). */
  exclude_sale_items?: boolean;
  /** Restrict to members at this tier or higher ("bronze" | "gold" | ...). */
  min_tier?: string | null;
}

export interface CouponInterface extends Document {
  code: string;
  discount_type: DiscountTypeEnum;
  value: number;
  min_order_amount: number;
  expiry_date: Date;
  starts_at: Date | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  max_discount: number | null;
  per_user_limit: number | null;
  per_user_window_days: number;
  category_scope: string[];
  electronics_only: boolean;
  exclude_electronics: boolean;
  exclude_sale_items: boolean;
  min_tier: string | null;
  created_at: Date;
}