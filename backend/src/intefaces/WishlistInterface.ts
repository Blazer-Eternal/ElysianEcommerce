import { Document, Types } from "mongoose";

export interface InputWishlistInterface {
  user_id: Types.ObjectId;
  product_id: Types.ObjectId;
}

export interface WishlistInterface extends InputWishlistInterface, Document {
  created_at: Date;
}