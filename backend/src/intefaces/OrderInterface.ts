import { Document, Types } from "mongoose";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "../enums/OrderEnums";

export interface OrderItemInterface {
  _id?: Types.ObjectId;
  product_id: Types.ObjectId;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderShippingAddressInterface {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface InputOrderInterface {
  user_id: Types.ObjectId;
  order_number: string;
  items: OrderItemInterface[];
  shipping_address: OrderShippingAddressInterface;
  coupon_id?: Types.ObjectId | null;
  subtotal: number;
  discount?: number;
  total_amount: number;
  status?: OrderStatusEnum;
  payment_status?: PaymentStatusEnum;
  payment_method?: PaymentMethodEnum;
}

export interface OrderInterface extends Document {
  user_id: Types.ObjectId;
  order_number: string;
  items: OrderItemInterface[];
  shipping_address: OrderShippingAddressInterface;
  coupon_id: Types.ObjectId | null;
  subtotal: number;
  discount: number;
  total_amount: number;
  status: OrderStatusEnum;
  payment_status: PaymentStatusEnum;
  payment_method: PaymentMethodEnum;
  created_at: Date;
}