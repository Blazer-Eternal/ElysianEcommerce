export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  _id: string;
  code: string;
  discount_type: DiscountType;
  value: number;
  min_order_amount: number;
  expiry_date: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateCouponPayload {
  code: string;
  discount_type: DiscountType;
  value: number;
  min_order_amount?: number;
  expiry_date: string;
  usage_limit?: number | null;
  is_active?: boolean;
}

export type UpdateCouponPayload = Partial<CreateCouponPayload>;

export interface ApplyCouponPayload {
  code: string;
  order_amount: number;
  /** Cart lines so the server previews with the exact checkout rules. */
  items?: Array<{ product_id: string; quantity: number }>;
}

export interface ApplyCouponResult {
  code: string;
  discount_type: DiscountType;
  discount_amount: number;
  final_amount: number;
  /** Subtotal of the items the coupon is allowed to discount (line previews only). */
  eligible_subtotal?: number;
}