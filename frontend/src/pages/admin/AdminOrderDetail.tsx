import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import AdminLayout from "../../components/layout/AdminLayout";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import type { OrderStatus } from "../../types/order.types";

const TIMELINE_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];
const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const AdminOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [localStatus, setLocalStatus] = useState<OrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: orderRes, isLoading, refetch } = useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
  });

  const order = orderRes?.data;

  // Sync localStatus with order.status when order loads
  useEffect(() => {
    if (order?.status) {
      setLocalStatus(order.status as OrderStatus);
    }
  }, [order?.status]);

  const handleUpdateStatus = async () => {
    if (!newStatus || !order) return;

    setIsSaving(true);
    try {
      await orderService.updateStatus(order._id, newStatus as OrderStatus);
      // Update local state immediately for instant UI feedback
      setLocalStatus(newStatus as OrderStatus);
      // Refetch to get updated order data
      await refetch();
      // Invalidate both caches
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId] });
      setNewStatus("");
      alert("Order status updated successfully!");
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIndex = (status: OrderStatus | null): number => {
    if (!status) return -1;
    return TIMELINE_STATUSES.indexOf(status);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="w-full px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="w-full px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Order not found.</p>
            <button
              onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e7c85] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
            >
              <BackIcon />
              Back to Orders
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
                className="flex items-center gap-2 text-[#0e7c85] hover:text-[#1a6b94] transition-colors mb-4 font-semibold"
              >
                <BackIcon />
                Back to Orders
              </button>
              <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Order Details</div>
              <h1 className="text-4xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-gray-600 mt-2">Placed on {formatDate(order.created_at)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Progress & Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Progress Timeline - HORIZONTAL */}
              <div className="glass rounded-xl p-8 border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
                <p className="text-sm text-gray-600 mb-8">Keep the customer order status up to date.</p>

                {/* Horizontal Timeline */}
                <div className="flex items-center justify-between gap-2">
                  {TIMELINE_STATUSES.map((status, index) => {
                    const currentStatusIndex = getStatusIndex(localStatus);
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex && currentStatusIndex < TIMELINE_STATUSES.length - 1;

                    return (
                      <div key={status} className="flex-1 flex items-center">
                        {/* Timeline Circle */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                            isCompleted
                              ? isCurrent
                                ? "bg-[#0e7c85] text-white scale-125"
                                : "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {isCompleted ? <CheckIcon /> : index + 1}
                        </div>

                        {/* Horizontal Connector Line */}
                        {index < TIMELINE_STATUSES.length - 1 && (
                          <div
                            className={`h-1 flex-1 mx-2 transition-colors ${
                              isCompleted && index < currentStatusIndex ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Status Labels */}
                <div className="flex items-center justify-between gap-2 mt-6 px-1">
                  {TIMELINE_STATUSES.map((status) => (
                    <div key={status} className="flex-1">
                      <p className="text-xs font-semibold text-gray-600 capitalize text-center">{status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordered Items */}
              <div className="glass rounded-xl p-8 border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ordered Items</h2>
                <p className="text-sm text-gray-600 mb-6">Items included in this order.</p>

                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-6 pb-6 border-b border-white/20 last:border-0">
                      {/* Item Image */}
                      {item.product_id && typeof item.product_id === "object" && (item.product_id as any).images?.[0] ? (
                        <img
                          src={(item.product_id as any).images[0]}
                          alt={item.product_name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
                          📦
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{item.product_name}</h3>
                        <div className="flex items-center gap-6 mt-3">
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Quantity</p>
                            <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Unit Price</p>
                            <p className="text-lg font-bold text-[#0e7c85]">{formatCurrency((item as any).price)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Total</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(((item as any).price || 0) * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-6 border-t border-white/20 flex justify-end">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium mb-1">Order Total</p>
                    <p className="text-4xl font-bold text-[#0e7c85]">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer Info & Status Update */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className="glass rounded-xl p-8 border border-white/20">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Customer</h2>

                {typeof order.user_id === "object" && (
                  <div className="space-y-4">
                    {/* Customer Avatar */}
                    <div className="flex items-center gap-4 pb-4 border-b border-white/20">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                        {order.user_id.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{order.user_id.name}</p>
                        <p className="text-xs text-gray-600">{(order.user_id as any).role || "Customer"}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-sm text-gray-900">{order.user_id.email}</p>
                    </div>

                    {/* Phone */}
                    {(order.user_id as any).phone && (
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Phone Number</p>
                        <p className="text-sm text-gray-900">{(order.user_id as any).phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Address - NO POSTAL CODE */}
              <div className="glass rounded-xl p-8 border border-white/20">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Address</h2>

                {order.shipping_address ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-900 font-medium">
                      {order.shipping_address.street || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address.city || "—"}, {order.shipping_address.state || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No delivery address available</p>
                )}
              </div>

              {/* Payment Summary - NO PAYMENT_METHOD */}
              <div className="glass rounded-xl p-8 border border-white/20">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between pb-3 border-b border-white/20">
                    <p className="text-sm text-gray-600">Items ({order.items.length})</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.payment_status === "unpaid"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.payment_status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Order Status */}
              <div className="glass rounded-xl p-8 border border-white/20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Update Order Status</h2>
                <p className="text-sm text-gray-600 mb-4">The customer will see the latest order status.</p>

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus | "")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85] mb-4"
                >
                  <option value="">Select new status...</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || isSaving}
                  className="w-full bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail;
