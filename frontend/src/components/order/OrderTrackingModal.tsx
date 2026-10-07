import { useEffect } from "react";
import type { Order } from "../../types/order.types";
import type { TrackingStep } from "../../utils/orderTracking";
import { getTrackingEvents, trackingCircleClass } from "../../utils/orderTracking";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import Button from "../ui/Button";
import { AlertIcon, CheckIcon, HomeIcon, TruckIcon, XIcon } from "../icons";

interface OrderTrackingModalProps {
  /** The order to show tracking details for; null keeps the modal closed. */
  order: Order | null;
  onClose: () => void;
}

const glyphFor = (step: TrackingStep) => {
  if (step.state === "done") return <CheckIcon size={16} />;
  if (step.status === "shipped") return <TruckIcon size={16} />;
  if (step.status === "delivered") return <HomeIcon size={16} />;
  return <CheckIcon size={16} />;
};

const OrderTrackingModal = ({ order, onClose }: OrderTrackingModalProps) => {
  useEffect(() => {
    if (!order) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [order, onClose]);

  if (!order) return null;

  const events = order.status === "cancelled" ? [] : getTrackingEvents(order);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Tracking details for order ${order.order_number}`}
        className="animate-scale-in flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#ece1d0] bg-white shadow-[0_2px_16px_rgba(61,5,12,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#ece1d0] px-6 pt-6 pb-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Placed {formatDate(order.created_at)} · Delivery to {order.shipping_address.city}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tracking details"
            className="-m-1 rounded-lg p-1 text-ink/50 transition-colors hover:bg-brand/5 hover:text-brand"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {order.status === "cancelled" ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertIcon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-red-700">This order was cancelled</p>
                <p className="mt-0.5 text-sm text-red-600/80">
                  No further tracking updates will appear for it.
                </p>
              </div>
            </div>
          ) : (
            <ol>
              {events.map((step, index) => (
                <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < events.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-9 bottom-0 left-4.25 w-0.5 rounded bg-green-500/60"
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${trackingCircleClass[step.state]}`}
                  >
                    {glyphFor(step)}
                  </span>
                  <div className="min-w-0 pt-1.5">
                    <p
                      className={`text-sm font-semibold ${
                        step.state === "current" ? "text-brand" : "text-gray-900"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.detail && (
                      <p className="mt-0.5 text-sm wrap-break-word text-gray-500">{step.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-cream-deep px-4 py-3 text-xs text-gray-600">
            <span>
              {order.items.length} item{order.items.length === 1 ? "" : "s"}
            </span>
            <span>{formatCurrency(order.total_amount)}</span>
            <span className="capitalize">
              {order.payment_method === "esewa" ? "eSewa" : "Cash on delivery"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#ece1d0] px-6 py-4">
          <Button type="button" variant="primary" size="sm" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
