import { Document, Types } from "mongoose";

export interface CartItemInterface {
  _id?: Types.ObjectId;
  product_id: Types.ObjectId;
  quantity: number;
}

export interface InputCartInterface {
  user_id: Types.ObjectId;
  items: CartItemInterface[];
}

export interface CartInterface extends InputCartInterface, Document {
  updated_at: Date;
}