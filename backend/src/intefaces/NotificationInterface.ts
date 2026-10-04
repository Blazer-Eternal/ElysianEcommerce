import { Document } from "mongoose";

export enum NotificationTypeEnum {
  signup = "signup",
  order = "order",
}

// Admin-facing activity notification (new signup / new order). Created
// server-side at the moment the event happens; never sent by the client.
export interface InputNotificationInterface {
  type: NotificationTypeEnum;
  title: string;
  message: string;
}

export interface NotificationInterface extends InputNotificationInterface, Document {
  read: boolean;
  created_at: Date;
}
