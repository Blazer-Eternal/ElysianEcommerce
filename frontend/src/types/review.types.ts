import type { PaginatedResponse } from "./pagination.types";

export interface Review {
  _id: string;
  user_id: { _id: string; name: string } | string;
  product_id: string;
  rating: number;
  comment?: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export type ReviewSort = "recent" | "oldest" | "rating_desc" | "rating_asc";

export interface ReviewStats {
  average: number;
  count: number;
  distribution: { star: number; count: number; percentage: number }[];
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  sort?: ReviewSort;
  rating?: number;
}

/** Full payload returned by GET /reviews/product/:productId */
export type ReviewListResponse = PaginatedResponse<Review> & {
  stats: ReviewStats;
  myReview: Review | null;
};

/** The product a review belongs to, trimmed to what the portal needs to draw the row. */
export interface MyReviewProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
}

/**
 * One of the signed-in customer's own reviews, joined to its product.
 * `product` is null when the product has since been removed, the rating and
 * comment still belong to the customer and stay listed.
 */
export interface MyReview {
  _id: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  product: MyReviewProduct | null;
}
