import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import AdminLayout from "../../components/layout/AdminLayout";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import type { OrderStatus, OrderShippingAddress } from "../../types/order.types";

const TIMELINE_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];
const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

const BackIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
));
BackIcon.displayName = "BackIcon";

const CheckIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
));
CheckIcon.displayName = "CheckIcon";

// Memoized Timeline Component
const OrderProgressTimeline = memo(({ localStatus }: { localStatus: OrderStatus | null }) => {
  const getStatusIndex = useCallback((status: OrderStatus | null): number => {
    if (!status) return -1;
    return TIMELINE_STATUSES.indexOf(status);
  }, []);

  const currentStatusIndex = useMemo(() => getStatusIndex(localStatus), [localStatus, getStatusIndex]);

  return (
    <div className="glass rounded-xl p-8 border border-white/20 card-container">
      <h2 className="text-xl font-bold text-gray-900 mb-6 animate-fade-in">Order Progress</h2>
      <p className="text-sm text-gray-600 mb-8 animate-fade-in animation-delay-100ms">Keep the customer order status up to date.</p>

      {/* Horizontal Timeline */}
      <div className="flex items-center justify-between gap-2 animate-fade-in animation-delay-200ms">
        {TIMELINE_STATUSES.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex && currentStatusIndex < TIMELINE_STATUSES.length - 1;

          return (
            <div key={status} className="flex-1 flex items-center">
              {/* Timeline Circle */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-smooth gpu-accelerate ${
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
  );
});
OrderProgressTimeline.displayName = "OrderProgressTimeline";

// Memoized Order Items Component
const OrderedItemsSection = memo(({ items, totalAmount }: any) => (
  <div className="glass rounded-xl p-8 border border-white/20 card-container">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Ordered Items</h2>
    <p className="text-sm text-gray-600 mb-6">Items included in this order.</p>

    <div className="space-y-6">
      {items.map((item: any, index: number) => (
        <div key={index} className="flex gap-6 pb-6 border-b border-white/20 last:border-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          {/* Item Image */}
          {item.product_id && typeof item.product_id === "object" && (item.product_id as any).images?.[0] ? (
            <img
              src={(item.product_id as any).images[0]}
              alt={item.product_name}
              className="w-24 h-24 rounded-lg object-cover gpu-accelerate"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-2xl flex-shrink-0">
              📦
            </div>
          )}

          {/* Item Details */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{item.product_name}</h3>
            <div className="flex items-center gap-6 mt-3 flex-wrap">
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
        <p className="text-4xl font-bold text-[#0e7c85]">{formatCurrency(totalAmount)}</p>
      </div>
    </div>
  </div>
));
OrderedItemsSection.displayName = "OrderedItemsSection";

// Memoized Customer Info Component
const CustomerInfoSection = memo(({ user }: any) => (
  <div className="glass rounded-xl p-8 border border-white/20 card-container">
    <h2 className="text-lg font-bold text-gray-900 mb-6">Customer</h2>

    {typeof user === "object" && (
      <div className="space-y-4 animate-fade-in">
        {/* Customer Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-white/20">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0e7c85] to-cyan-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600">{(user as any).role || "Customer"}</p>
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Email Address</p>
          <p className="text-sm text-gray-900 break-all">{user.email}</p>
        </div>

        {/* Phone */}
        {(user as any).phone && (
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Phone Number</p>
            <p className="text-sm text-gray-900">{(user as any).phone}</p>
          </div>
        )}
      </div>
    )}
  </div>
));
CustomerInfoSection.displayName = "CustomerInfoSection";

// Memoized Delivery Address Component
const DeliveryAddressSection = memo(({ address, onEdit, canEdit }: any) => (
  <div className="glass rounded-xl p-8 border border-white/20 card-container">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
      {canEdit && (
        <button
          onClick={onEdit}
          className="text-sm px-3 py-1.5 bg-[#0e7c85]/10 text-[#0e7c85] font-semibold rounded-lg hover:bg-[#0e7c85]/20 transition-smooth"
        >
          ✏️ Edit
        </button>
      )}
    </div>

    {address ? (
      <div className="space-y-3 animate-fade-in">
        <p className="text-sm text-gray-900 font-medium">
          {address.street || "—"}
        </p>
        <p className="text-sm text-gray-600">
          {address.city || "—"}, {address.state || "—"}
        </p>
      </div>
    ) : (
      <p className="text-sm text-gray-600">No delivery address available</p>
    )}
  </div>
));
DeliveryAddressSection.displayName = "DeliveryAddressSection";

// Memoized Payment Summary Component
const PaymentSummarySection = memo(({ order }: any) => (
  <div className="glass rounded-xl p-8 border border-white/20 card-container">
    <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h2>

    <div className="space-y-3 animate-fade-in">
      <div className="flex justify-between pb-3 border-b border-white/20">
        <p className="text-sm text-gray-600">Items ({order.items.length})</p>
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(order.total_amount)}
        </p>
      </div>

      <div className="flex justify-between">
        <p className="text-sm text-gray-600">Payment Status</p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold transition-smooth ${
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
));
PaymentSummarySection.displayName = "PaymentSummarySection";

// Memoized Update Status Component
const UpdateStatusSection = memo(({ newStatus, onStatusChange, onUpdateStatus, isSaving }: any) => (
  <div className="glass rounded-xl p-8 border border-white/20 card-container">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Update Order Status</h2>
    <p className="text-sm text-gray-600 mb-4">The customer will see the latest order status.</p>

    <select
      value={newStatus}
      onChange={onStatusChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-smooth mb-4"
    >
      <option value="">Select new status...</option>
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>

    <button
      onClick={onUpdateStatus}
      disabled={!newStatus || isSaving}
      className="w-full bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white py-3 rounded-lg hover:shadow-lg transition-smooth duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSaving ? "Saving..." : "Save Status"}
    </button>
  </div>
));
UpdateStatusSection.displayName = "UpdateStatusSection";

// Memoized Edit Address Modal
const EditAddressModal = memo(({ isOpen, address, onClose, onChange, onSave, isSaving }: any) => {
  if (!isOpen || !address) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Shipping Address</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Street</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => onChange("street", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-smooth"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => onChange("city", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-smooth"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-smooth"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Zip Code</label>
              <input
                type="text"
                value={address.zip}
                onChange={(e) => onChange("zip", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-smooth"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => onChange("country", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-smooth"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-smooth"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
});
EditAddressModal.displayName = "EditAddressModal";

// Main Admin Order Detail Component
const AdminOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [localStatus, setLocalStatus] = useState<OrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState<OrderShippingAddress | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const { data: orderRes, isLoading, refetch } = useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });

  const order = orderRes?.data;

  // Sync localStatus with order.status when order loads
  useEffect(() => {
    if (order?.status) {
      setLocalStatus(order.status as OrderStatus);
    }
  }, [order?.status]);

  const handleUpdateStatus = useCallback(async () => {
    if (!newStatus || !order) return;

    setIsSaving(true);
    try {
      await orderService.updateStatus(order._id, newStatus as OrderStatus);
      setLocalStatus(newStatus as OrderStatus);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId] });
      setNewStatus("");
      alert("Order status updated successfully!");
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }, [newStatus, order, refetch, queryClient, orderId]);

  const handleEditAddress = useCallback(() => {
    if (order) {
      setEditedAddress(order.shipping_address);
      setIsEditingAddress(true);
    }
  }, [order]);

  const handleSaveAddress = useCallback(async () => {
    if (!orderId || !editedAddress) return;
    setIsSavingAddress(true);
    try {
      await orderService.updateShippingAddress(orderId, editedAddress);
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId] });
      setIsEditingAddress(false);
      alert("Shipping address updated successfully!");
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsSavingAddress(false);
    }
  }, [orderId, editedAddress, queryClient]);

  const handleAddressChange = useCallback((field: keyof OrderShippingAddress, value: string) => {
    if (editedAddress) {
      setEditedAddress({ ...editedAddress, [field]: value });
    }
  }, [editedAddress]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="w-full px-responsive py-8">
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
        <div className="w-full px-responsive py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Order not found.</p>
            <button
              onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0e7c85] text-white rounded-lg hover:bg-[#1a6b94] transition-smooth"
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
      <div ref={containerRef} className="w-full px-responsive py-8 section-container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between animate-fade-in">
            <div>
              <button
                onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
                className="flex items-center gap-2 text-[#0e7c85] hover:text-[#1a6b94] transition-smooth mb-4 font-semibold"
              >
                <BackIcon />
                Back to Orders
              </button>
              <div className="text-sm font-semibold text-[#0e7c85] uppercase tracking-wider mb-2">Order Details</div>
              <h1 className="text-responsive-h2 font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-gray-600 mt-2">Placed on {formatDate(order.created_at)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Progress & Items */}
            <div className="lg:col-span-2 space-y-8">
              <OrderProgressTimeline localStatus={localStatus} />
              <OrderedItemsSection items={order.items} totalAmount={order.total_amount} />
            </div>

            {/* Right Column - Customer Info & Status Update */}
            <div className="space-y-8">
              {typeof order.user_id === "object" && <CustomerInfoSection user={order.user_id} />}
              <DeliveryAddressSection 
                address={order.shipping_address} 
                onEdit={handleEditAddress}
                canEdit={order.status === "pending" || order.status === "paid"}
              />
              <EditAddressModal 
                isOpen={isEditingAddress}
                address={editedAddress}
                onClose={() => setIsEditingAddress(false)}
                onChange={handleAddressChange}
                onSave={handleSaveAddress}
                isSaving={isSavingAddress}
              />
              <PaymentSummarySection order={order} />
              <UpdateStatusSection 
                newStatus={newStatus}
                onStatusChange={(e: any) => setNewStatus(e.target.value)}
                onUpdateStatus={handleUpdateStatus}
                isSaving={isSaving}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail;
