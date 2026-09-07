import { z } from "zod";

export const createCategoryValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  parent_id: z.string().nullable().optional(),
  description: z.string().optional(),
});

export const updateCategoryValidator = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated")
    .optional(),
  parent_id: z.string().nullable().optional(),
  description: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategoryValidator>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryValidator>;