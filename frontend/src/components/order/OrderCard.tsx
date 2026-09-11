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
      className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 p-6 transition-all duration-500 hover:from-white/90 hover:to-white/60 hover:border-white/80 hover:shadow-2xl hover:shadow-cyan-200/30 active:scale-95"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e7c85]/5 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-bold text-lg text-gray-900 tracking-tight">{order.order_number}</p>
            <p className="text-sm text-gray-500 mt-1.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex-shrink-0 transform transition-transform duration-300 group-hover:scale-110">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Footer Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[#0e7c85]/20 to-cyan-600/20 text-xs font-semibold text-[#0e7c85]">
              {order.items.length}
            </span>
            <span className="text-sm text-gray-600">
              item{order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>

      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-gradient-to-r from-[#0e7c85]/20 via-transparent to-cyan-600/20" />
    </Link>
  );
};

export default OrderCard;
