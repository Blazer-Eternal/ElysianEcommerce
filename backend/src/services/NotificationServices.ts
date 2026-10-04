import { NotificationModel } from "../models/NotificationModel";
import {
  InputNotificationInterface,
  NotificationInterface,
  NotificationTypeEnum,
} from "../intefaces/NotificationInterface";

const RECENT_LIMIT = 30;

/**
 * Creates an admin notification. Fire-and-forget: a notification failure must
 * never break the signup/order flow that triggered it, so callers do not await
 * (or await a swallowed error).
 */
export class NotificationServices {
  public async record(data: InputNotificationInterface): Promise<void> {
    try {
      await NotificationModel.create(data);
    } catch (error) {
      console.error("Failed to record admin notification:", error);
    }
  }

  /** Convenience helpers so controllers do not hand-build titles/messages. */
  public async recordSignup(name: string, email: string): Promise<void> {
    await this.record({
      type: NotificationTypeEnum.signup,
      title: "New user registered",
      message: `${name || "A customer"} joined with ${email}`,
    });
  }

  public async recordOrder(orderNumber: string, amount: number, customerName?: string): Promise<void> {
    const who = customerName ? `${customerName} placed` : "A customer placed";
    await this.record({
      type: NotificationTypeEnum.order,
      title: "New order received",
      message: `${who} order ${orderNumber} worth Rs. ${amount.toLocaleString("en-IN")}`,
    });
  }

  /** Latest notifications plus the unread badge count for the bell. */
  public async getRecent(): Promise<{ notifications: NotificationInterface[]; unreadCount: number }> {
    const [notifications, unreadCount] = await Promise.all([
      NotificationModel.find().sort({ created_at: -1 }).limit(RECENT_LIMIT),
      NotificationModel.countDocuments({ read: false }),
    ]);

    return { notifications, unreadCount };
  }

  public async markAllRead(): Promise<void> {
    await NotificationModel.updateMany({ read: false }, { read: true });
  }
}
