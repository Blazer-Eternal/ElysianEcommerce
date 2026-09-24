import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types/category.types";

export const categoryService = {
  getAll: async (config?: { signal?: AbortSignal }): Promise<ApiResponse<Category[]>> => {
    const { data } = await axiosInstance.get("/categories", { signal: config?.signal });
    return data;
  },

  getById: async (id: string, config?: { signal?: AbortSignal }): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.get(`/categories/${id}`, { signal: config?.signal });
    return data;
  },

  getChildren: async (id: string, config?: { signal?: AbortSignal }): Promise<ApiResponse<Category[]>> => {
    const { data } = await axiosInstance.get(`/categories/${id}/children`, { signal: config?.signal });
    return data;
  },

  create: async (payload: CreateCategoryPayload): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.post("/categories", payload);
    return data;
  },

  update: async (id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.patch(`/categories/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data;
  },
};