import { Document } from "mongoose";

// A message sent by a customer through the public "Get in Touch" / Contact Us page.
export interface InputMessageInterface {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface MessageInterface extends InputMessageInterface, Document {
  is_read: boolean;
  created_at: Date;
}
