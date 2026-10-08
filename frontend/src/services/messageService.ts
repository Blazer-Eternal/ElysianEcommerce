import axiosInstance from "./axiosInstance";
import type {
  CreateMessagePayload,
  Message,
  MessageContext,
  MessageListResponse,
  MessageStatus,
  MessageTag,
} from "../types/message.types";

export interface GetAllMessagesParams {
  page?: number;
  limit?: number;
  status?: MessageStatus | "all";
  tag?: MessageTag | "all";
  q?: string;
  signal?: AbortSignal;
}

export interface UpdateMessagePayload {
  subject?: string;
  tag?: MessageTag;
  reply?: string;
  is_read?: boolean;
  archived?: boolean;
}

export const messageService = {
  /** Public: submit the Contact Us / Get in Touch form. */
  create: async (payload: CreateMessagePayload): Promise<{ success: boolean; message: string; data: Message }> => {
    const { data } = await axiosInstance.post("/messages", payload);
    return data;
  },

  /** Admin: paginated inbox, filterable by status, topic and free text. */
  getAll: async (params: GetAllMessagesParams = {}): Promise<MessageListResponse> => {
    const { page, limit, status, tag, q, signal } = params;
    const { data } = await axiosInstance.get("/messages", {
      params: {
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        ...(status && status !== "all" ? { status } : {}),
        ...(tag && tag !== "all" ? { tag } : {}),
        ...(q && q.trim() ? { q: q.trim() } : {}),
      },
      signal,
    });
    return data;
  },

  /** Admin: the thread plus the sender's account and recent orders. */
  getContext: async (id: string, config?: { signal?: AbortSignal }): Promise<MessageContext> => {
    const { data } = await axiosInstance.get(`/messages/${id}/context`, { signal: config?.signal });
    return data.data;
  },

  /** Admin: mark one message as read. */
  markRead: async (id: string): Promise<{ success: boolean; data: Message }> => {
    const { data } = await axiosInstance.patch(`/messages/read/${id}`);
    return data;
  },

  /** Admin: retag, correct the subject, reply, archive, flip read state. */
  update: async (id: string, payload: UpdateMessagePayload): Promise<{ success: boolean; data: Message }> => {
    const { data } = await axiosInstance.patch(`/messages/${id}`, payload);
    return data;
  },

  /** Admin: delete a message. */
  remove: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`/messages/${id}`);
    return data;
  },
};
