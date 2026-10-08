import { z } from "zod";
import { MESSAGE_TAG_VALUES, MessageTagEnum } from "../enums/MessageEnums";

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
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject must be less than 150 characters"),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message must be less than 2000 characters"),
  // Optional: the topic select defaults to "other" when left untouched.
  tag: z.enum(MESSAGE_TAG_VALUES as unknown as [MessageTagEnum, ...MessageTagEnum[]]).optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageValidator>;

/**
 * Admin-side edit of an inbox row: retag, correct the subject, answer the
 * thread, flip read/archived. Everything is optional so a partial patch of any
 * single field is valid.
 */
export const updateMessageValidator = z
  .object({
    subject: z.string().trim().min(3).max(150).optional(),
    tag: z.enum(MESSAGE_TAG_VALUES as unknown as [MessageTagEnum, ...MessageTagEnum[]]).optional(),
    reply: z.string().trim().max(2000).optional(),
    is_read: z.boolean().optional(),
    archived: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  });
