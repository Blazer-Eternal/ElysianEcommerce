import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { couponService } from "../../services/couponService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import ViewToggle, { type ViewMode } from "../../components/ui/ViewToggle";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ORDER_STATUS_LABELS } from "../../constants/orderStatus";
import type { OrderStatus, PaymentStatus } from "../../types/order.types";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "paid", "refunded"];
const PAGE_SIZE = 6;

const ViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ManageOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", page, statusFilter],
    queryFn: ({ signal }) =>
      orderService.getAll(page, PAGE_SIZE, {
        signal,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  // Fetch coupons to create a lookup map
  const { data: couponsRes } = useQuery({
    queryKey: ["coupons"],
    queryFn: ({ signal }) => couponService.getAll({ signal }),
    staleTime: 10 * 60 * 1000,
  });

  // Create a map of coupon ID to coupon code
  const couponMap = new Map<string, string>();
  if (couponsRes?.data) {
    couponsRes.data.forEach((coupon) => {
      couponMap.set(coupon._id, coupon.code);
    });
  }

  const getCouponCode = (couponId: string | null | undefined) => {
    if (!couponId) return null;
    return couponMap.get(couponId) || couponId; // Return code or ID as fallback
  };

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

  const handleFilterChange = (value: OrderStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  // Scroll to top when page changes
  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-auto");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">Admin Panel</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Orders</h1>
              <p className="text-gray-600 mt-2">All customer orders, with status and payment controls.</p>
            </div>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Status:</span>
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                statusFilter === "all"
                  ? "bg-brand text-white"
                  : "bg-white text-gray-600 border border-[#ece1cf] hover:border-brand/30 hover:text-brand"
              }`}
            >
              All
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-brand text-white"
                    : "bg-white text-gray-600 border border-[#ece1cf] hover:border-brand/30 hover:text-brand"
                }`}
              >
                {ORDER_STATUS_LABELS[status]}
              </button>
            ))}
          </div>

          {/* Orders Table / Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center bg-white rounded-2xl border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] px-6 py-12">
              <p className="text-gray-600 text-lg">
                {statusFilter === "all" ? "No orders found." : `No ${statusFilter} orders found.`}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <>
              <div className="bg-white rounded-2xl overflow-hidden border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header */}
                    <thead>
                      <tr className="border-b border-[#ece1cf] bg-linear-to-r from-brand/5 to-cyan-600/5">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order #</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Items</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Coupon</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Payment</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-[#ece1cf]">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-cream-deep/50 transition-colors">
                          {/* Order Number */}
                          <td className="px-6 py-4">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="text-sm font-bold text-brand hover:text-brand-dark transition-colors"
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
                            <span className="text-sm font-bold text-brand">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </td>

                          {/* Coupon Applied */}
                          <td className="px-6 py-4">
                            {order.coupon_id && order.discount && order.discount > 0 ? (
                              <div className="flex flex-col gap-1">
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold max-w-fit">
                                  {typeof order.coupon_id === "object" ? order.coupon_id.code : getCouponCode(order.coupon_id)}
                                </span>
                                <span className="text-xs text-green-700 font-semibold">
                                  -{formatCurrency(order.discount)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 italic">No coupon</span>
                            )}
                          </td>

                          {/* Order Status */}
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                              className="px-3 py-1 border border-[#e2d7c5] rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand"
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
                              className="px-3 py-1 border border-[#e2d7c5] rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand"
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
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all duration-200 font-semibold text-xs whitespace-nowrap"
                              title="View Order Details"
                            >
                              <ViewIcon />
                              View Orders
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)] transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="bg-linear-to-br from-brand/10 to-cyan-600/10 p-6 flex items-start justify-between">
                    <div>
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-lg font-bold text-brand hover:text-brand-dark transition-colors"
                      >
                        #{order.order_number}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentBadgeColor(order.payment_status)}`}>
                        {order.payment_status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Customer</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {typeof order.user_id === "object" ? order.user_id.name : "—"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {typeof order.user_id === "object" ? order.user_id.email : "—"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-[#ece1cf]">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Items</p>
                        <p className="font-bold text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Total</p>
                        <p className="font-bold text-brand">{formatCurrency(order.total_amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Coupon</p>
                        <p className="font-bold text-gray-900">
                          {order.coupon_id && order.discount && order.discount > 0
                            ? typeof order.coupon_id === "object"
                              ? order.coupon_id.code
                              : getCouponCode(order.coupon_id)
                            : "No coupon"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Discount</p>
                        <p className="font-bold text-gray-900">
                          {order.discount && order.discount > 0 ? `-${formatCurrency(order.discount)}` : "—"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all duration-200 font-semibold text-sm"
                      title="View Order Details"
                    >
                      <ViewIcon />
                      View Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {orders.length > 0 && data?.pagination && (
            <div className="mt-8">
              <Pagination pagination={data.pagination} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
