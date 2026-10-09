import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { NotificationServices, AdminBriefServices } from "../../services";

export class NotificationController {
  /**
   * Admin: the Daily Update panel. Six groups (sales, inventory, support,
   * shipping, system, marketing) derived live from the store's own records,
   * nothing here is stored, so it is never stale.
   */
  static async getDailyBrief(req: CustomRequestInterface, res: Response) {
    try {
      const brief = await new AdminBriefServices().build();

      return res.status(200).json({ success: true, data: brief });
    } catch (error) {
      console.error("getDailyBrief error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  /** Admin: latest notifications + unread count for the bell badge. */
  static async getNotifications(req: CustomRequestInterface, res: Response) {
    try {
      const { notifications, unreadCount } = await new NotificationServices().getRecent();

      return res.status(200).json({ success: true, data: notifications, unreadCount });
    } catch (error) {
      console.error("getNotifications error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  /** Admin: clear the badge after the bell dropdown has been seen. */
  static async markAllRead(req: CustomRequestInterface, res: Response) {
    try {
      await new NotificationServices().markAllRead();

      return res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("markAllRead error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
