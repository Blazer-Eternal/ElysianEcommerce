import axiosInstance from "./axiosInstance";
import type { NotificationListResponse } from "../types/notification.types";

export const notificationService = {
  /** Admin: recent activity feed + unread badge count. */
  getAll: async (signal?: AbortSignal): Promise<NotificationListResponse> => {
    const { data } = await axiosInstance.get("/notifications", { signal });
    return data;
  },

  /** Admin: clear the badge once the bell dropdown has been opened. */
  markAllRead: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.post("/notifications/read-all");
    return data;
  },
};
