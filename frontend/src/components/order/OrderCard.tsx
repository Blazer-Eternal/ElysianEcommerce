import { Link } from "react-router-dom";
import type { Order } from "../../types/order.types";
import type { OrderFlag } from "../../types/loyalty.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ROUTES } from "../../constants/routes";
import OrderStatusBadge from "./OrderStatusBadge";
import Button from "../ui/Button";

/** Small pill telling the shopper how this order counts towards their tier. */
const LOYALTY_PILL: Record<OrderFlag["state"], string> = {
  counts: "border-gold/30 bg-cream-deep text-gold-dark",
  pending: "border-sand bg-cream text-ink/60",
  excluded: "border-ink/10 bg-white text-ink/45",
};

interface OrderCardProps {
  order: Order;
  /** Opens the live-tracking modal for this order. */
  onTrack: () => void;
  /** How this order counts towards the loyalty tier, when known. */
  loyaltyFlag?: OrderFlag;
}

const OrderCard = ({ order, onTrack, loyaltyFlag }: OrderCardProps) => {
  const itemNames = order.items.map((item) => item.product_name).join(", ");

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#ece1d0] bg-white p-5 transition-all duration-300 hover:border-brand/30 hover:shadow-[0_6px_24px_rgba(61,5,12,0.1)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={ROUTES.ORDER_DETAIL(order._id)}
            className="text-lg font-bold tracking-tight text-gray-900 transition-colors hover:text-brand"
          >
            #{order.order_number}
          </Link>
          <OrderStatusBadge status={order.status} />
          {loyaltyFlag && (
            <span
              title={loyaltyFlag.detail ?? undefined}
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${LOYALTY_PILL[loyaltyFlag.state]}`}
            >
              {loyaltyFlag.label}
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-sm text-gray-500">
          Placed on {formatDate(order.created_at)} · Items: {itemNames}
        </p>

        <p className="mt-1 text-sm font-bold text-gray-900">
          Total: <span className="text-brand">{formatCurrency(order.total_amount)}</span>
        </p>
      </div>

      <div className="shrink-0">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onTrack}
          className="px-5 py-2.5 text-sm font-semibold"
        >
          Track
        </Button>
      </div>
    </article>
  );
};

export default OrderCard;
