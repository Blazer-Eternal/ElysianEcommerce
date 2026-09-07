import { z } from "zod";

export const addWishlistValidator = z.object({
  product_id: z.string().min(1, "Product ID is required"),
});

export type AddWishlistInput = z.infer<typeof addWishlistValidator>;