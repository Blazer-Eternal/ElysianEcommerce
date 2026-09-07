import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type { Cart, AddCartItemPayload, UpdateCartItemPayload } from "../types/cart.types";

export const cartService = {
  get: async (): Promise<ApiResponse<Cart>> => {
    const { data } = await axiosInstance.get("/cart");
    return data;
  },

  addItem: async (payload: AddCartItemPayload): Promise<ApiResponse<Cart>> => {
    const { data } = await axiosInstance.post("/cart/items", payload);
    return data;
  },

  updateItem: async (productId: string, payload: UpdateCartItemPayload): Promise<ApiResponse<Cart>> => {
    const { data } = await axiosInstance.patch(`/cart/items/${productId}`, payload);
    return data;
  },

  removeItem: async (productId: string): Promise<ApiResponse<Cart>> => {
    const { data } = await axiosInstance.delete(`/cart/items/${productId}`);
    return data;
  },

  clear: async (): Promise<ApiResponse<Cart>> => {
    const { data } = await axiosInstance.delete("/cart");
    return data;
  },
};