import { z } from "zod";

// Ratings are half-star steps (0.5, 1, 1.5 … 5), matching the star picker UI.
const halfStarRating = (message: string) =>
  z
    .number()
    .min(0.5, message)
    .max(5, message)
    .refine((value) => Math.round(value * 2) / 2 === value, {
      message: "Rating must be in half-star steps (e.g. 3.5)",
    });

export const createReviewValidator = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  rating: halfStarRating("Rating must be between 0.5 and 5"),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

export const updateReviewValidator = z.object({
  rating: halfStarRating("Rating must be between 0.5 and 5").optional(),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewValidator>;
export type UpdateReviewInput = z.infer<typeof updateReviewValidator>;
