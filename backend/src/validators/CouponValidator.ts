import { z } from "zod";

export const createCouponValidator = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(30, "Code must be less than 30 characters"),
  discount_type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0, "Value cannot be negative"),
  min_order_amount: z.number().min(0, "Minimum order amount cannot be negative").optional(),
  expiry_date: z.coerce.date({ error: "A valid expiry date is required" }),
  starts_at: z.coerce.date().nullable().optional(),
  usage_limit: z.number().min(1, "Usage limit must be at least 1").nullable().optional(),
  max_discount: z.number().min(0).nullable().optional(),
  per_user_limit: z.number().min(1).nullable().optional(),
  per_user_window_days: z.number().min(1).optional(),
  category_scope: z.array(z.string()).optional(),
  electronics_only: z.boolean().optional(),
  exclude_electronics: z.boolean().optional(),
  exclude_sale_items: z.boolean().optional(),
  min_tier: z.enum(["bronze", "gold", "platinum", "diamond"]).nullable().optional(),
  is_active: z.boolean().optional(),
});

export const updateCouponValidator = z.object({
  code: z.string().min(3).max(30).optional(),
  discount_type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().min(0).optional(),
  min_order_amount: z.number().min(0).optional(),
  expiry_date: z.coerce.date().optional(),
  starts_at: z.coerce.date().nullable().optional(),
  usage_limit: z.number().min(1).nullable().optional(),
  max_discount: z.number().min(0).nullable().optional(),
  per_user_limit: z.number().min(1).nullable().optional(),
  per_user_window_days: z.number().min(1).optional(),
  category_scope: z.array(z.string()).optional(),
  electronics_only: z.boolean().optional(),
  exclude_electronics: z.boolean().optional(),
  exclude_sale_items: z.boolean().optional(),
  min_tier: z.enum(["bronze", "gold", "platinum", "diamond"]).nullable().optional(),
  is_active: z.boolean().optional(),
});

export const applyCouponValidator = z.object({
  code: z.string().min(1, "Coupon code is required"),
  order_amount: z.number().min(0, "Order amount cannot be negative"),
  // Optional cart lines: when present the preview runs the exact same
  // eligibility rules as order creation (scope, electronics, sale items, caps).
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .max(100)
    .optional(),
});

export type CreateCouponInput = z.infer<typeof createCouponValidator>;
export type UpdateCouponInput = z.infer<typeof updateCouponValidator>;
export type ApplyCouponInput = z.infer<typeof applyCouponValidator>;