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
  // Buy Now: order lines supplied directly instead of being read from the cart,
  // so the product never touches the customer's cart. Omit it for a normal
  // cart checkout.
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required")
    .optional(),
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