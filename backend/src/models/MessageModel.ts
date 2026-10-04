import { Schema, model } from "mongoose";
import { MessageInterface } from "../intefaces/MessageInterface";

const MessageSchema = new Schema<MessageInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 200,
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 30,
    default: "",
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Newest-first inbox listing with a fast unread filter.
MessageSchema.index({ is_read: 1, created_at: -1 });

export const MessageModel = model<MessageInterface>("Message", MessageSchema);
