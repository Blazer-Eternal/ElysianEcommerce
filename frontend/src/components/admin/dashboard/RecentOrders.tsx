import { memo } from "react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty } from "./PanelStates";
import { CartIcon } from "./icons";
import { ROUTES } from "../../../constants/routes";
import { formatCurrency } from "../../../utils/formatCurrency";
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

// Neutral avatar tints — the store has no customer photos, so initials stand in.
const AVATAR_TINTS = ["bg-brand/10 text-brand", "bg-indigo-100 text-indigo-600", "bg-amber-100 text-amber-700"];

const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Latest orders as a table (order id / customer / status / amount / action).
 * "Details" opens the very same order screen the ManageOrders "View Orders"
 * button leads to, so the dashboard and the orders page never diverge.
 */
const RecentOrders = memo(({ orders, isLoading }: RecentOrdersProps) => (
  <DashboardPanel
    title="Recent Orders"
    icon={<CartIcon size={18} />}
    action={
      <Link
        to={ROUTES.ADMIN_ORDERS}
        className="text-xs font-semibold text-brand hover:underline shrink-0"
      >
        View All Orders
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3 first:rounded-l-lg">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right last:rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => {
              const customer =
                typeof order.user_id === "object" ? order.user_id.name : "Customer";

              return (
                <tr key={order._id} className="transition-fast hover:bg-gray-50/70">
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {order.order_number}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          AVATAR_TINTS[index % AVATAR_TINTS.length]
                        }`}
                        aria-hidden="true"
                      >
                        {initials(customer) || "?"}
                      </span>
                      <span className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                        {customer}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formatCurrency(order.total_amount)}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={ROUTES.ADMIN_ORDER_DETAIL(order._id)}
                      className="text-sm font-semibold text-brand hover:underline whitespace-nowrap"
                      title="View Order Details"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </DashboardPanel>
));
RecentOrders.displayName = "RecentOrders";

export default RecentOrders;
