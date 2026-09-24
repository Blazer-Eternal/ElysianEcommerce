import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type { WishlistItem, AddWishlistPayload } from "../types/wishlist.types";

export const wishlistService = {
  getAll: async (config?: { signal?: AbortSignal }): Promise<ApiResponse<WishlistItem[]>> => {
    const { data } = await axiosInstance.get("/wishlist", { signal: config?.signal });
    return data;
  },

  add: async (payload: AddWishlistPayload): Promise<ApiResponse<WishlistItem>> => {
    const { data } = await axiosInstance.post("/wishlist", payload);
    return data;
  },

  remove: async (productId: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/wishlist/${productId}`);
    return data;
  },
};