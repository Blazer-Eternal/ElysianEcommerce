export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface OrderItem {
  _id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  _id: string;
  user_id: { _id: string; name: string; email: string } | string;
  order_number: string;
  items: OrderItem[];
  shipping_address: OrderShippingAddress;
  coupon_id: { _id: string; code: string; discount_type: string; value: number } | string | null;
  subtotal: number;
  discount: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface CreateOrderPayload {
  shipping_address: OrderShippingAddress;
  coupon_code?: string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface UpdatePaymentStatusPayload {
  payment_status: PaymentStatus;
}