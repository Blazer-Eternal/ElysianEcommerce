import type { Order, OrderStatus } from "../types/order.types";

/** Statuses of orders that are still moving towards the customer. */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped"];

export const isActiveOrder = (order: Order): boolean =>
  ACTIVE_ORDER_STATUSES.includes(order.status);

/** Lifetime spend: every order that was not cancelled (delivered or in flight). */
export const getTotalSpent = (orders: Order[]): number =>
  orders.reduce((sum, order) => (order.status === "cancelled" ? sum : sum + order.total_amount), 0);

export const getActiveOrders = (orders: Order[]): Order[] => orders.filter(isActiveOrder);

/**
 * The order shown in the "Active shipment" panel: the most recent one that is
 * still on its way, preferring the furthest-along state (shipped beats paid
 * beats pending) so an older in-transit parcel is never hidden behind a fresh
 * unpaid one.
 */
export const getActiveShipment = (orders: Order[]): Order | undefined => {
  const active = getActiveOrders(orders);
  const rank = (order: Order) => ACTIVE_ORDER_STATUSES.indexOf(order.status);

  // Active orders arrive newest-first; a stable sort keeps that order inside
  // each status group.
  return [...active].sort((a, b) => rank(b) - rank(a))[0];
};

/**
 * "Buy it again": distinct products from past orders, most recently ordered
 * first. Duplicate lines collapse to the newest purchase of that product.
 */
export const getRepeatBuys = (orders: Order[], limit = 4): Array<{
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}> => {
  const seen = new Set<string>();
  const repeats: Array<{ productId: string; name: string; unitPrice: number; quantity: number }> = [];

  for (const order of orders) {
    for (const item of order.items) {
      if (!item.product_id || seen.has(item.product_id)) continue;
      seen.add(item.product_id);
      repeats.push({
        productId: item.product_id,
        name: item.product_name,
        unitPrice: item.unit_price,
        quantity: item.quantity,
      });
      if (repeats.length >= limit) return repeats;
    }
  }

  return repeats;
};
