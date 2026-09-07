import type { Product } from "./product.types";

export interface WishlistItem {
  _id: string;
  user_id: string;
  product_id: Product | string;
  created_at: string;
}

export interface AddWishlistPayload {
  product_id: string;
}