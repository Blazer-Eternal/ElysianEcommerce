import axiosInstance from "./axiosInstance";
import type {
  CustomerNotificationListResponse,
  NotificationListResponse,
} from "../types/notification.types";
import type { AdminBrief } from "../types/dailyBrief.types";

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

  /**
   * Customer: the signed-in user's own feed, derived server-side from their
   * orders, wishlist, cart, coupons and reviews.
   */
  getCustomer: async (signal?: AbortSignal): Promise<CustomerNotificationListResponse> => {
    const { data } = await axiosInstance.get("/notifications/customer", { signal });
    return data;
  },

  /** Customer: persist read markers for specific notification keys. */
  markCustomerRead: async (keys: string[]): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.post("/notifications/customer/read", { keys });
    return data;
  },

  /** Customer: mark everything currently in the feed as read. */
  markCustomerAllRead: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.post("/notifications/customer/read", { keys: [] });
    return data;
  },

  /**
   * Admin: the Daily Update brief — 6 groups (sales, inventory, support,
   * shipping, system, marketing) derived live from the database.
   */
  getDailyBrief: async (signal?: AbortSignal): Promise<AdminBrief> => {
    const { data } = await axiosInstance.get("/notifications/daily-brief", { signal });
    return data.data;
  },
};
