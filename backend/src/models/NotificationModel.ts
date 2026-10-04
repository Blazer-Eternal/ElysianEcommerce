import { Schema, model } from "mongoose";
import { NotificationInterface, NotificationTypeEnum } from "../intefaces/NotificationInterface";

const NotificationSchema = new Schema<NotificationInterface>({
  type: {
    type: String,
    enum: Object.values(NotificationTypeEnum),
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Unread-first inbox listing for the admin bell dropdown.
NotificationSchema.index({ read: 1, created_at: -1 });

export const NotificationModel = model<NotificationInterface>("Notification", NotificationSchema);
