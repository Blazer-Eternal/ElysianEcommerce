import axiosInstance from "./axiosInstance";
import type { CreateMessagePayload, Message, MessageListResponse } from "../types/message.types";

export const messageService = {
  /** Public: submit the Contact Us / Get in Touch form. */
  create: async (payload: CreateMessagePayload): Promise<{ success: boolean; message: string; data: Message }> => {
    const { data } = await axiosInstance.post("/messages", payload);
    return data;
  },

  /** Admin: paginated inbox (optionally filtered by read state). */
  getAll: async (
    params: { page?: number; limit?: number; isRead?: boolean; signal?: AbortSignal } = {}
  ): Promise<MessageListResponse> => {
    const { page, limit, isRead, signal } = params;
    const { data } = await axiosInstance.get("/messages", {
      params: {
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        ...(isRead === undefined ? {} : { isRead }),
      },
      signal,
    });
    return data;
  },

  /** Admin: mark one message as read. */
  markRead: async (id: string): Promise<{ success: boolean; data: Message }> => {
    const { data } = await axiosInstance.patch(`/messages/read/${id}`);
    return data;
  },

  /** Admin: delete a message. */
  remove: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`/messages/${id}`);
    return data;
  },
};
