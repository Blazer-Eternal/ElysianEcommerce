import axiosInstance from "./axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/pagination.types";
import type { User, Address } from "../types/user.types";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export type AddressPayload = Omit<Address, "_id">;
export type UpdateAddressPayload = Partial<AddressPayload>;

export const userService = {
  getById: async (id: string, config?: { signal?: AbortSignal }): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get(`/users/${id}`, { signal: config?.signal });
    return data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.patch(`/users/${id}`, payload);
    return data;
  },

  addAddress: async (id: string, payload: AddressPayload): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.post(`/users/${id}/addresses`, payload);
    return data;
  },

  updateAddress: async (
    id: string,
    addressId: string,
    payload: UpdateAddressPayload
  ): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.patch(`/users/${id}/addresses/${addressId}`, payload);
    return data;
  },

  removeAddress: async (id: string, addressId: string): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.delete(`/users/${id}/addresses/${addressId}`);
    return data;
  },

  getAll: async (page = 1, limit = 20, config?: { signal?: AbortSignal }): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosInstance.get("/users", {
      params: { page, limit },
      signal: config?.signal,
    });
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/users/${id}`);
    return data;
  },
};