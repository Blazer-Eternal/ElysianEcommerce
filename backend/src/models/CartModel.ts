import { Schema, model } from "mongoose";
import { CartInterface, CartItemInterface } from "../intefaces/CartInterface";

const CartItemSchema = new Schema<CartItemInterface>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const CartSchema = new Schema<CartInterface>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: {
    type: [CartItemSchema],
    default: [],
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const CartModel = model<CartInterface>("Cart", CartSchema);