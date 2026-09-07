import { z } from "zod";

export const createReviewValidator = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

export const updateReviewValidator = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewValidator>;
export type UpdateReviewInput = z.infer<typeof updateReviewValidator>;