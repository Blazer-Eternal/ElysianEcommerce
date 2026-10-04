export type NotificationType = "signup" | "order";

/** Admin-facing activity feed entry (new signup / new customer order). */
export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

/** GET /notifications — bell feed plus the unread badge count. */
export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
}
