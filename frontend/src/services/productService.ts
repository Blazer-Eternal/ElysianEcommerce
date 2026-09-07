import axiosInstance from "./axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/pagination.types";
import type { Product, ProductQueryParams, CreateProductPayload, UpdateProductPayload } from "../types/product.types";

export const productService = {
  getAll: async (params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const { data } = await axiosInstance.get("/products", { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  },

  getByCategory: async (categoryId: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await axiosInstance.get(`/products/category/${categoryId}`);
    return data;
  },

  create: async (payload: CreateProductPayload): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.post("/products", payload);
    return data;
  },

  update: async (id: string, payload: UpdateProductPayload): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.patch(`/products/${id}`, payload);
    return data;
  },

  updateStock: async (id: string, stock: number): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.patch(`/products/${id}/stock`, { stock });
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data;
  },

  uploadImages: async (files: File[]): Promise<ApiResponse<{ images: string[] }>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const { data } = await axiosInstance.post("/products/upload-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};