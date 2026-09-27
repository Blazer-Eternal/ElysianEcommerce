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
