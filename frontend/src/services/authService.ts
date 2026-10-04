import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/pagination.types";
import type {
  SignupPayload,
  LoginPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponseData,
  User,
} from "../types/user.types";

export const authService = {
  googleInitiate: async (credential: string): Promise<ApiResponse<{ email: string; attemptsRemaining: number }>> => {
    const { data } = await axiosInstance.post("/auth/google/initiate", { credential });
    return data;
  },

  googleResend: async (email: string): Promise<ApiResponse<{ email: string; attemptsRemaining: number }>> => {
    const { data } = await axiosInstance.post("/auth/google/resend", { email });
    return data;
  },

  googleVerify: async (email: string, otp: string): Promise<ApiResponse<AuthResponseData>> => {
    const { data } = await axiosInstance.post("/auth/google/verify", { email, otp });
    return data;
  },

  signup: async (payload: SignupPayload): Promise<ApiResponse<Pick<User, "_id" | "name" | "email" | "role">>> => {
    const { data } = await axiosInstance.post("/auth/signup", payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.patch("/auth/change-password", payload);
    return data;
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.post("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/auth/reset-password", payload);
    return data;
  },
};