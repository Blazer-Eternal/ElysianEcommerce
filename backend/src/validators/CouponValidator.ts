import { z } from "zod";

export const createCouponValidator = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(30, "Code must be less than 30 characters"),
  discount_type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0, "Value cannot be negative"),
  min_order_amount: z.number().min(0, "Minimum order amount cannot be negative").optional(),
  expiry_date: z.coerce.date({ error: "A valid expiry date is required" }),
  usage_limit: z.number().min(1, "Usage limit must be at least 1").nullable().optional(),
  is_active: z.boolean().optional(),
});

export const updateCouponValidator = z.object({
  code: z.string().min(3).max(30).optional(),
  discount_type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().min(0).optional(),
  min_order_amount: z.number().min(0).optional(),
  expiry_date: z.coerce.date().optional(),
  usage_limit: z.number().min(1).nullable().optional(),
  is_active: z.boolean().optional(),
});

export const applyCouponValidator = z.object({
  code: z.string().min(1, "Coupon code is required"),
  order_amount: z.number().min(0, "Order amount cannot be negative"),
});

export type CreateCouponInput = z.infer<typeof createCouponValidator>;
export type UpdateCouponInput = z.infer<typeof updateCouponValidator>;
export type ApplyCouponInput = z.infer<typeof applyCouponValidator>;