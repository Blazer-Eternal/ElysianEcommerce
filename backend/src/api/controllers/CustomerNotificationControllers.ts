import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { CustomerNotificationServices } from "../../services";

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, message: "Authentication required" });

/**
 * Customer-facing notification endpoints.
 *
 * These sit alongside the admin-only NotificationController and deliberately
 * reuse none of its storage: everything returned here is derived live from the
 * signed-in customer's own Orders / Wishlist / Cart / Coupons / Reviews, so the
 * feed can only ever describe records that actually exist.
 */
export class CustomerNotificationController {
  /** The signed-in customer's derived feed plus their unread badge count. */
  static async getFeed(req: CustomRequestInterface, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return unauthorized(res);

      const { notifications, unreadCount } = await new CustomerNotificationServices().getFeed(
        userId
      );

      return res.status(200).json({ success: true, data: notifications, unreadCount });
    } catch (error) {
      console.error("getCustomerNotifications error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  /**
   * Mark specific keys as read. An absent or empty `keys` array means
   * "everything currently in the feed" — the mark-all-as-read button.
   */
  static async markRead(req: CustomRequestInterface, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return unauthorized(res);

      const rawKeys: unknown = req.body?.keys;
      const keys = Array.isArray(rawKeys)
        ? rawKeys.filter((key): key is string => typeof key === "string")
        : undefined;

      await new CustomerNotificationServices().markRead(userId, keys);

      return res.status(200).json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
      console.error("markCustomerNotificationsRead error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
