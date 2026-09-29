import { memo } from "react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty } from "./PanelStates";
import { CartIcon } from "./icons";
import { ROUTES } from "../../../constants/routes";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import type { Order, OrderStatus } from "../../../types/order.types";

interface RecentOrdersProps {
  orders: Order[] | undefined;
  isLoading: boolean;
}

// Same status palette used across ManageOrders / AdminOrderDetail.
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

/** Last few orders with status badges - the dashboard's live order feed. */
const RecentOrders = memo(({ orders, isLoading }: RecentOrdersProps) => (
  <DashboardPanel
    title="Recent Orders"
    icon={<CartIcon size={18} />}
    action={
      <Link
        to={ROUTES.ADMIN_ORDERS}
        className="text-xs font-semibold text-[#0e7c85] hover:underline shrink-0"
      >
        View All
      </Link>
    }
    className="h-full"
  >
    {isLoading ? (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    ) : !orders || orders.length === 0 ? (
      <PanelEmpty message="No orders yet" hint="New orders will show up here instantly." />
    ) : (
      <ul className="space-y-3">
        {orders.map((order) => {
          const customer =
            typeof order.user_id === "object" ? order.user_id.name : "Customer";
          const firstName = customer.split(" ")[0];

          return (
            <li
              key={order._id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-white/70 transition-fast hover:border-[#0e7c85]/25"
            >
              <span className="shrink-0 w-10 h-10 rounded-lg bg-[#0e7c85]/10 text-[#0e7c85] flex items-center justify-center">
                <CartIcon size={18} />
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{order.order_number}</p>
                <p className="text-xs text-gray-500 truncate">
                  {firstName} · {formatDate(order.created_at)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${STATUS_STYLES[order.status]}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </DashboardPanel>
));
RecentOrders.displayName = "RecentOrders";

export default RecentOrders;
