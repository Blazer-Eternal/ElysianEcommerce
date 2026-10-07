import { Link } from "react-router-dom";
import type { Order } from "../../types/order.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ROUTES } from "../../constants/routes";
import OrderStatusBadge from "./OrderStatusBadge";
import Button from "../ui/Button";

interface OrderCardProps {
  order: Order;
  /** Opens the live-tracking modal for this order. */
  onTrack: () => void;
}

const OrderCard = ({ order, onTrack }: OrderCardProps) => {
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
