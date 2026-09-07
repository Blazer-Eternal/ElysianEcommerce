export type UserRole = "customer" | "admin";

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: Address[];
  created_at: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponseData {
  resetToken?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthResponseData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}