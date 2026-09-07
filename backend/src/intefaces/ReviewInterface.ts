import { Document, Types } from "mongoose";

export interface InputReviewInterface {
  user_id: Types.ObjectId;
  product_id: Types.ObjectId;
  rating: number;
  comment?: string;
  verified_purchase?: boolean;
}

export interface ReviewInterface extends InputReviewInterface, Document {
  created_at: Date;
}