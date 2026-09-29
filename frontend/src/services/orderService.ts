import axiosInstance from "./axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/pagination.types";
import type { Order, CreateOrderPayload, CreateOrderResponseData, OrderStatus, PaymentStatus, OrderStats, DashboardAnalytics, OrderShippingAddress } from "../types/order.types";

export const orderService = {
  create: async (payload: CreateOrderPayload): Promise<CreateOrderResponseData> => {
    const { data } = await axiosInstance.post("/orders", payload);
    return data;
  },

  verifyEsewaPayment: async (preOrderToken: string): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.post("/orders/esewa/verify", { preOrderToken });
    return data;
  },

  getMyOrders: async (page = 1, limit = 20, config?: { signal?: AbortSignal }): Promise<PaginatedResponse<Order>> => {
    const { data } = await axiosInstance.get("/orders/my-orders", {
      params: { page, limit },
      signal: config?.signal,
    });
    return data;
  },

  getById: async (id: string, config?: { signal?: AbortSignal }): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.get(`/orders/${id}`, { signal: config?.signal });
    return data;
  },

  cancel: async (id: string): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/cancel`);
    return data;
  },

  getAll: async (page = 1, limit = 20, config?: { signal?: AbortSignal }): Promise<PaginatedResponse<Order>> => {
    const { data } = await axiosInstance.get("/orders", {
      params: { page, limit },
      signal: config?.signal,
    });
    return data;
  },

  // Admin dashboard aggregates - a handful of numbers computed by the database
  // instead of downloading full orders to sum in the browser.
  getStats: async (config?: { signal?: AbortSignal }): Promise<ApiResponse<OrderStats>> => {
    const { data } = await axiosInstance.get("/orders/stats", { signal: config?.signal });
    return data;
  },

  // Time-series analytics for the dashboard charts (sales overview, top
  // categories/products, demand trends, AOV, activity feed) for the last
  // `days` days plus the matching previous period for comparison.
  getAnalytics: async (days = 30, config?: { signal?: AbortSignal }): Promise<ApiResponse<DashboardAnalytics>> => {
    const { data } = await axiosInstance.get("/orders/analytics", {
      params: { days },
      signal: config?.signal,
    });
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

  updateShippingAddress: async (id: string, shipping_address: OrderShippingAddress): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/shipping-address`, { shipping_address });
    return data;
  },
};