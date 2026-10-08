import { Document } from "mongoose";
import { MessageTagEnum } from "../enums/MessageEnums";

// A message sent by a customer through the public "Get in Touch" / Contact Us page.
export interface InputMessageInterface {
  name: string;
  email: string;
  phone?: string;
  /** One-line summary the admin scans before opening the thread. */
  subject: string;
  message: string;
  /** Topic bucket; defaulted from the subject/body when the sender skips it. */
  tag?: MessageTagEnum;
}

export interface MessageInterface extends InputMessageInterface, Document {
  tag: MessageTagEnum;
  /** Admin's written reply. Empty string while the thread is still unanswered. */
  reply: string;
  replied_at: Date | null;
  is_read: boolean;
  archived: boolean;
  created_at: Date;
}
