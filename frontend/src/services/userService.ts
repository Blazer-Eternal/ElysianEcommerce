import axiosInstance from "./axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/pagination.types";
import type { User, Address, UserRole } from "../types/user.types";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export type AddressPayload = Omit<Address, "_id">;
export type UpdateAddressPayload = Partial<AddressPayload>;

export const userService = {
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get(`/users/${id}`);
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

  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
    const { data } = await axiosInstance.get("/users", { params: { page, limit } });
    return data;
  },

  assignRole: async (id: string, role: UserRole): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.patch(`/users/${id}/role`, { role });
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/users/${id}`);
    return data;
  },
};