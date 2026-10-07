import type { Order, OrderStatus } from "../types/order.types";
import { formatDateTime } from "./formatDate";

/**
 * Live-tracking view of an order, derived entirely from the order document.
 *
 * The database stores one status field plus `created_at` — there is no
 * shipment/carrier table — so every caption below is a rendering of a value
 * that is actually on the record. Steps the order has not reached yet carry
 * no detail instead of an invented one.
 */

export type TrackingStepState = "done" | "current" | "upcoming";

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  state: TrackingStepState;
  /** Factual caption sourced from the order; null when the record says nothing. */
  detail: string | null;
}

/** Circle skin for a step, shared by the dashboard stepper and the modal. */
export const trackingCircleClass: Record<TrackingStepState, string> = {
  done: "bg-green-500 text-white shadow-lg shadow-green-500/40",
  current: "bg-brand text-white ring-4 ring-brand/15",
  upcoming: "bg-sand text-gray-400",
};

/** The progression path, in order: mirrors the stepper the portal has always used. */
const PROGRESSION: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

const STEP_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  paid: "Processed",
  shipped: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const detailFor = (order: Order, status: OrderStatus, state: TrackingStepState): string | null => {
  if (state === "upcoming") return null;

  switch (status) {
    case "pending":
      return formatDateTime(order.created_at);
    case "paid":
      if (order.payment_status === "paid") {
        return `Paid via ${order.payment_method === "esewa" ? "eSewa" : "cash on delivery"}`;
      }
      return order.payment_status === "refunded"
        ? "Payment refunded"
        : "Awaiting payment";
    case "shipped":
      return `On the way to ${order.shipping_address.city}`;
    case "delivered":
      return `Delivered to ${order.shipping_address.city}`;
    default:
      return null;
  }
};

/** The four progression steps for an order, each marked done/current/upcoming. */
export const getTrackingSteps = (order: Order): TrackingStep[] => {
  const currentIndex = PROGRESSION.indexOf(order.status);

  return PROGRESSION.map((status, index) => {
    const state: TrackingStepState =
      index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";

    return {
      status,
      label: STEP_LABELS[status],
      state,
      detail: detailFor(order, status, state),
    };
  });
};

/**
 * Milestones reached so far, newest first — the list the tracking modal
 * renders. Cancelled orders never enter the progression, so they yield no
 * events and the modal shows the cancellation notice instead.
 */
export const getTrackingEvents = (order: Order): TrackingStep[] =>
  getTrackingSteps(order)
    .filter((step) => step.state !== "upcoming")
    .reverse();
