import axiosInstance from "./axiosInstance";
import type { GetReviewsParams, ReviewListResponse, Review, MyReview, CreateReviewPayload, UpdateReviewPayload } from "../types/review.types";
import type { PaginatedResponse } from "../types/pagination.types";

export const reviewService = {
  /**
   * The signed-in customer's own reviews across every product they have
   * written about, newest first — powers the Reviews tab of the portal.
   */
  getMyReviews: async (
    page = 1,
    limit = 10,
    config?: { signal?: AbortSignal }
  ): Promise<PaginatedResponse<MyReview>> => {
    const { data } = await axiosInstance.get("/reviews/my", {
      params: { page, limit },
      signal: config?.signal,
    });
    return data;
  },

  getAll: async (
    params: { page?: number; limit?: number; sort?: string; signal?: AbortSignal } = {}
  ): Promise<PaginatedResponse<Review>> => {
    const { signal, ...query } = params;
    const { data } = await axiosInstance.get("/reviews/admin/all", {
      params: {
        ...(query.page ? { page: query.page } : {}),
        ...(query.limit ? { limit: query.limit } : {}),
        ...(query.sort ? { sort: query.sort } : {}),
      },
      signal,
    });
    return data;
  },

  getByProduct: async (
    productId: string,
    params: GetReviewsParams & { signal?: AbortSignal } = {}
  ): Promise<ReviewListResponse> => {
    const { signal, ...query } = params;
    const { data } = await axiosInstance.get(`/reviews/product/${productId}`, {
      params: {
        ...(query.page ? { page: query.page } : {}),
        ...(query.limit ? { limit: query.limit } : {}),
        ...(query.sort ? { sort: query.sort } : {}),
        ...(query.rating ? { rating: query.rating } : {}),
      },
      signal,
    });
    return data;
  },

  create: async (payload: CreateReviewPayload): Promise<{ success: boolean; data: Review }> => {
    const { data } = await axiosInstance.post("/reviews", payload);
    return data;
  },

  update: async (id: string, payload: UpdateReviewPayload): Promise<{ success: boolean; data: Review }> => {
    const { data } = await axiosInstance.patch(`/reviews/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<{ success: boolean; data: null }> => {
    const { data } = await axiosInstance.delete(`/reviews/${id}`);
    return data;
  },
};
