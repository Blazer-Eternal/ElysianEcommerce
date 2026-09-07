import { Link } from "react-router-dom";
import type { Order } from "../../types/order.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ROUTES } from "../../constants/routes";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Link
      to={ROUTES.ORDER_DETAIL(order._id)}
      className="border rounded-lg p-4 block hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{order.order_number}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-gray-600">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </span>
        <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
      </div>
    </Link>
  );
};

export default OrderCard;