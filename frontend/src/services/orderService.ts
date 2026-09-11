import axiosInstance from "./axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/pagination.types";
import type { Order, CreateOrderPayload, CreateOrderResponseData, OrderStatus, PaymentStatus } from "../types/order.types";

export const orderService = {
  create: async (payload: CreateOrderPayload): Promise<CreateOrderResponseData> => {
    const { data } = await axiosInstance.post("/orders", payload);
    return data;
  },

  verifyEsewaPayment: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.get("/orders/esewa/verify", { params: { order_number: orderNumber } });
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

  updateShippingAddress: async (id: string, shipping_address: any): Promise<ApiResponse<Order>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/shipping-address`, { shipping_address });
    return data;
  },
};