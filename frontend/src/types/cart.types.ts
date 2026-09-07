import type { Product } from "./product.types";

export interface CartItem {
  _id?: string;
  product_id: Product | string;
  quantity: number;
}

export interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[];
  updated_at: string;
}

export interface AddCartItemPayload {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}