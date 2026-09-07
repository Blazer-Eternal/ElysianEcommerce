import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type { Review, CreateReviewPayload, UpdateReviewPayload } from "../types/review.types";

export const reviewService = {
  getByProduct: async (productId: string): Promise<ApiResponse<Review[]>> => {
    const { data } = await axiosInstance.get(`/reviews/product/${productId}`);
    return data;
  },

  create: async (payload: CreateReviewPayload): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.post("/reviews", payload);
    return data;
  },

  update: async (id: string, payload: UpdateReviewPayload): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.patch(`/reviews/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/reviews/${id}`);
    return data;
  },
};