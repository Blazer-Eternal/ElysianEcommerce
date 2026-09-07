import { Document, Types } from "mongoose";
import { ProductStatusEnum } from "../enums/ProductEnums";

export interface InputProductInterface {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  cost_price?: number;
  stock: number;
  category_id: Types.ObjectId;
  images: string[];
  status: ProductStatusEnum;
}

export interface ProductInterface extends InputProductInterface, Document {
  rating_avg: number;
  rating_count: number;
  created_at: Date;
}