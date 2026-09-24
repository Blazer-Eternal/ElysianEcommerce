export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type PaymentMethod = "cod" | "esewa";

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
  payment_method: PaymentMethod;
  created_at: string;
}

export interface CreateOrderPayload {
  shipping_address: OrderShippingAddress;
  coupon_code?: string;
  payment_method: PaymentMethod;
}

export interface EsewaPaymentFields {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface CreateOrderResponseData {
  success: boolean;
  message: string;
  data?: Order;
  preOrderToken?: string;
  esewa?: {
    fields: EsewaPaymentFields;
    gatewayUrl: string;
  };
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface UpdatePaymentStatusPayload {
  payment_status: PaymentStatus;
}

// Response data of GET /orders/stats (admin dashboard aggregates, computed
// by the database - not derived client-side from raw orders).
export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueLast30Days: number;
  averageOrderValue: number;
}