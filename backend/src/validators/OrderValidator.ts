import { z } from "zod";

export const createOrderValidator = z.object({
  shipping_address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
    country: z.string().min(1, "Country is required"),
  }),
  coupon_code: z.string().optional(),
  payment_method: z.enum(["cod", "esewa"]).default("cod"),
});

export const updateOrderStatusValidator = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
});

export const updatePaymentStatusValidator = z.object({
  payment_status: z.enum(["unpaid", "paid", "refunded"]),
});

export type CreateOrderInput = z.infer<typeof createOrderValidator>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusValidator>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusValidator>;