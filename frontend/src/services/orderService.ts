import axiosInstance from "./axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/pagination.types";
import type { Order, CreateOrderPayload, OrderStatus, PaymentStatus } from "../types/order.types";

export const orderService = {
  create: async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.post("/orders", payload);
    return data;
  },

  getMyOrders: async (page = 1, limit = 20): Promise<PaginatedResponse<Order>> => {
    const { data } = await axiosInstance.get("/orders/my-orders", { params: { page, limit } });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.get(`/orders/${id}`);
    return data;
  },

  cancel: async (id: string): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/cancel`);
    return data;
  },

  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Order>> => {
    const { data } = await axiosInstance.get("/orders", { params: { page, limit } });
    return data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return data;
  },

  updatePaymentStatus: async (id: string, payment_status: PaymentStatus): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/payment-status`, { payment_status });
    return data;
  },
};