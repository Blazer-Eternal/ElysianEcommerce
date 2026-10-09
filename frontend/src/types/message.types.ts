import type { PaginatedResponse } from "./pagination.types";

/** Topic buckets; mirrors `MessageTagEnum` on the backend. */
export type MessageTag =
  | "order"
  | "shipping"
  | "refund"
  | "pre_sales"
  | "product"
  | "payment"
  | "account"
  | "feedback"
  | "other"
  | "spam";

/** Inbox filter states; mirrors `MessageStatusEnum`. */
export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  tag: MessageTag;
  is_read: boolean;
  reply?: string;
  replied_at?: string | null;
  archived?: boolean;
  created_at: string;
}

export interface CreateMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  tag?: MessageTag;
}

/** Per-status tallies driving the inbox filter chips (whole inbox, unfiltered). */
export interface MessageCounts {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

/** GET /messages, inbox listing with the filter tallies. */
export type MessageListResponse = PaginatedResponse<Message> & {
  counts: MessageCounts;
  unreadCount: number;
};

/** One sender's account + their most recent orders (GET /messages/:id/context). */
export interface MessageContextCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string | null;
}

export interface MessageContextOrder {
  _id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items: Array<{ product_name: string; quantity: number }>;
}

export interface MessageContext {
  message: Message;
  customer: MessageContextCustomer | null;
  orders: MessageContextOrder[];
}
