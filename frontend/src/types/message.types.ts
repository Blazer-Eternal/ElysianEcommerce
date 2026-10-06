import type { PaginatedResponse } from "./pagination.types";

/** A message submitted through the public Contact Us / Get in Touch form. */
export interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateMessagePayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/** GET /messages, inbox listing with the unread badge count. */
export type MessageListResponse = PaginatedResponse<Message> & {
  unreadCount: number;
};
