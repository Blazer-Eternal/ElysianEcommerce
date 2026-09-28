import { z } from "zod";

// Ratings are whole stars only (1, 2, 3, 4, 5), matching the star picker UI.
const wholeStarRating = (message: string) =>
  z
    .number()
    .min(1, message)
    .max(5, message)
    .refine((value) => Number.isInteger(value), {
      message: "Rating must be a whole number of stars (e.g. 3)",
    });

export const createReviewValidator = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  rating: wholeStarRating("Rating must be between 1 and 5"),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

export const updateReviewValidator = z.object({
  rating: wholeStarRating("Rating must be between 1 and 5").optional(),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewValidator>;
export type UpdateReviewInput = z.infer<typeof updateReviewValidator>;
