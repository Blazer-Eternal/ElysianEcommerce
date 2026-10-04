import { z } from "zod";

// Public "Get in Touch" form — unauthenticated, so validation is strict.
export const createMessageValidator = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please provide a valid email address").max(200, "Email must be less than 200 characters"),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export type CreateMessageInput = z.infer<typeof createMessageValidator>;
