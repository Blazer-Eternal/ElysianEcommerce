import { z } from "zod";

export const signupValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(7, "Phone number is too short").max(20, "Phone number is too long"),
});

export const loginValidator = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserValidator = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
});

export const changePasswordValidator = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const forgotPasswordValidator = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export const resetPasswordValidator = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const addressValidator = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  country: z.string().min(1, "Country is required"),
  is_default: z.boolean().optional(),
});

export const updateAddressValidator = z.object({
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zip: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  is_default: z.boolean().optional(),
});

export const assignRoleValidator = z.object({
  role: z.enum(["customer", "admin"]),
});

export type SignupInput = z.infer<typeof signupValidator>;
export type LoginInput = z.infer<typeof loginValidator>;
export type UpdateUserInput = z.infer<typeof updateUserValidator>;
export type ChangePasswordInput = z.infer<typeof changePasswordValidator>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordValidator>;
export type ResetPasswordInput = z.infer<typeof resetPasswordValidator>;
export type AddressInput = z.infer<typeof addressValidator>;
export type UpdateAddressInput = z.infer<typeof updateAddressValidator>;
export type AssignRoleInput = z.infer<typeof assignRoleValidator>;