import { z } from "zod";

export const addCartItemValidator = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
});

export const updateCartItemValidator = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type AddCartItemInput = z.infer<typeof addCartItemValidator>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemValidator>;