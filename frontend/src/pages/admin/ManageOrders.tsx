import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { OrderStatus, PaymentStatus } from "../../types/order.types";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "paid", "refunded"];

const ViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ManageOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => orderService.getAll(page, 15),
  });

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await orderService.updateStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePaymentStatusChange = async (id: string, payment_status: PaymentStatus) => {
    try {
      await orderService.updatePaymentStatus(id, payment_status);
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const orders = data?.data || [];

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadgeColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Admin Panel</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Orders</h1>
            <p className="text-gray-600 mt-2">View and manage all customer orders.</p>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 glass rounded-xl p-6 border border-white/20">
              <p className="text-gray-600 text-lg">No orders found.</p>
            </div>
          ) : (
            <>
              <div className="glass rounded-xl overflow-hidden border border-white/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header */}
                    <thead>
                      <tr className="border-b border-white/20 bg-linear-to-r from-[#0e7c85]/5 to-cyan-600/5">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Order #</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Order Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-white/20">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-linear-to-r hover:from-[#0e7c85]/5 hover:to-cyan-600/5 transition-colors">
                          {/* Order Number */}
                          <td className="px-6 py-4">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="text-sm font-bold text-[#0e7c85] hover:text-[#1a6b94] transition-colors"
                            >
                              #{order.order_number}
                            </Link>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {typeof order.user_id === "object" ? order.user_id.name : "—"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {typeof order.user_id === "object" ? order.user_id.email : "—"}
                            </div>
                          </td>

                          {/* Items Count */}
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </span>
                          </td>

                          {/* Total */}
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#0e7c85]">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </td>

                          {/* Order Status */}
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                            <div className="mt-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(order.status)}`}>
                                {order.status.toUpperCase()}
                              </span>
                            </div>
                          </td>

                          {/* Payment Status */}
                          <td className="px-6 py-4">
                            <select
                              value={order.payment_status}
                              onChange={(e) => handlePaymentStatusChange(order._id, e.target.value as PaymentStatus)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
                            >
                              {PAYMENT_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                            <div className="mt-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getPaymentBadgeColor(order.payment_status)}`}>
                                {order.payment_status.toUpperCase()}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-sm"
                            >
                              <ViewIcon />
                              View Order
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {data?.pagination && (
                <div className="mt-8">
                  <Pagination pagination={data.pagination} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
