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

export interface BuyNowItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shipping_address: OrderShippingAddress;
  coupon_code?: string;
  payment_method: PaymentMethod;
  /** Buy Now lines, omitted for a normal checkout, which uses the cart. */
  items?: BuyNowItem[];
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

// ---- GET /orders/analytics (admin dashboard charts) ------------------------

/** One zero-filled UTC day bucket. */
export interface AnalyticsPoint {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
  paidOrders: number;
  units: number;
  customers: number;
  products: number;
}

export interface AnalyticsTotals {
  revenue: number;
  orders: number;
  paidOrders: number;
  units: number;
  customers: number;
  products: number;
}

export interface TopCategory {
  category_id: string | null;
  name: string;
  units: number;
  revenue: number;
}

export interface TopProduct {
  product_id: string;
  name: string | null;
  image: string | null;
  units: number;
  revenue: number;
}

export interface ActivityItem {
  id: string;
  type: "order" | "user" | "review";
  title: string;
  subtitle: string;
  at: string;
}

export interface DashboardAnalytics {
  days: number;
  current: AnalyticsPoint[];
  previous: AnalyticsPoint[];
  totals: { current: AnalyticsTotals; previous: AnalyticsTotals };
  topCategories: TopCategory[];
  topProducts: TopProduct[];
  recentActivity: ActivityItem[];
}