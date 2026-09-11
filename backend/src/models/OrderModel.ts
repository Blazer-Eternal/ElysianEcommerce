import { Schema, model } from "mongoose";
import { OrderInterface, OrderItemInterface, OrderShippingAddressInterface } from "../intefaces/OrderInterface";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "../enums/OrderEnums";

const OrderItemSchema = new Schema<OrderItemInterface>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit_price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const OrderShippingAddressSchema = new Schema<OrderShippingAddressInterface>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderInterface>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  order_number: {
    type: String,
    required: true,
    unique: true,
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (arr: OrderItemInterface[]) => arr.length >= 1,
      message: "Order must contain at least one item",
    },
  },
  shipping_address: {
    type: OrderShippingAddressSchema,
    required: true,
  },
  coupon_id: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    default: null,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatusEnum),
    default: OrderStatusEnum.pending,
  },
  payment_status: {
    type: String,
    enum: Object.values(PaymentStatusEnum),
    default: PaymentStatusEnum.unpaid,
  },
  payment_method: {
    type: String,
    enum: Object.values(PaymentMethodEnum),
    default: PaymentMethodEnum.cod,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const OrderModel = model<OrderInterface>("Order", OrderSchema);