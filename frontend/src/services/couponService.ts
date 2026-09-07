import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type {
  ApplyCouponPayload,
  ApplyCouponResult,
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
} from "../types/coupon.types";

export const couponService = {
  apply: async (payload: ApplyCouponPayload): Promise<ApiResponse<ApplyCouponResult>> => {
    const { data } = await axiosInstance.post("/coupons/apply", payload);
    return data;
  },

  getAll: async (): Promise<ApiResponse<Coupon[]>> => {
    const { data } = await axiosInstance.get("/coupons");
    return data;
  },

  create: async (payload: CreateCouponPayload): Promise<ApiResponse<Coupon>> => {
    const { data } = await axiosInstance.post("/coupons", payload);
    return data;
  },

  update: async (id: string, payload: UpdateCouponPayload): Promise<ApiResponse<Coupon>> => {
    const { data } = await axiosInstance.patch(`/coupons/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/coupons/${id}`);
    return data;
  },
};