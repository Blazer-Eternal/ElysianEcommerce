import { z } from "zod";

export const createProductValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200, "Name must be less than 200 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price cannot be negative"),
  cost_price: z.number().min(0, "Cost price cannot be negative").optional(),
  stock: z.number().min(0, "Stock cannot be negative").default(0),
  category_id: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  status: z.enum(["active", "draft", "archived"]).optional(),
});

export const updateProductValidator = z.object({
  name: z.string().min(2).max(200).optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated")
    .optional(),
  description: z.string().min(10).optional(),
  sku: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  cost_price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  category_id: z.string().min(1).optional(),
  images: z.array(z.string()).min(1).optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
});

export const updateStockValidator = z.object({
  stock: z.number().min(0, "Stock cannot be negative"),
});

export type CreateProductInput = z.infer<typeof createProductValidator>;
export type UpdateProductInput = z.infer<typeof updateProductValidator>;
export type UpdateStockInput = z.infer<typeof updateStockValidator>;