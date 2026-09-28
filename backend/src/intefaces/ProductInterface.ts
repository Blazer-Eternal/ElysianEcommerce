import { Document, Types } from "mongoose";
import { ProductStatusEnum } from "../enums/ProductEnums";

export interface InputProductInterface {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  cost_price?: number;
  /** Maximum retail price — the struck-through original price shown on the storefront. */
  mrp?: number;
  /** Displayed brand (e.g. "Dot & Key"); purely presentational. */
  brand?: string;
  /** Bullet points rendered in the "Product Benefits" section. */
  key_benefits?: string[];
  /** Bullet points rendered in the "How to Use" section. */
  how_to_use?: string[];
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