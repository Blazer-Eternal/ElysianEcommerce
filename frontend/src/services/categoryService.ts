import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types/category.types";

export const categoryService = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await axiosInstance.get("/categories");
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },

  getChildren: async (id: string): Promise<ApiResponse<Category[]>> => {
    const { data } = await axiosInstance.get(`/categories/${id}/children`);
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