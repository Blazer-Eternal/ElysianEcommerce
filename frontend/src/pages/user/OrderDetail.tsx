import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orderService } from "../../services/orderService";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import OrderTimeline from "../../components/order/OrderTimeline";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import type { OrderShippingAddress } from "../../types/order.types";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState<OrderShippingAddress | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id as string),
    enabled: !!id,
  });

  const handleCancel = async () => {
    if (!id || !confirm("Cancel this order?")) return;
    try {
      await orderService.cancel(id);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleEditAddress = () => {
    if (order) {
      setEditedAddress(order.shipping_address);
      setIsEditingAddress(true);
    }
  };

  const handleSaveAddress = async () => {
    if (!id || !editedAddress) return;
    setIsSavingAddress(true);
    try {
      await orderService.updateShippingAddress(id, editedAddress);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      setIsEditingAddress(false);
      alert("Shipping address updated successfully!");
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleAddressChange = (field: keyof OrderShippingAddress, value: string) => {
    if (editedAddress) {
      setEditedAddress({ ...editedAddress, [field]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-600">Order not found.</p>
          <Link
            to={ROUTES.ORDER_HISTORY}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        to={ROUTES.ORDER_HISTORY}
        className="inline-flex items-center gap-2 text-[#0e7c85] hover:text-cyan-600 font-semibold mb-8 transition-colors duration-300 group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{order.order_number}</h1>
            <p className="text-gray-600">{formatDate(order.created_at)}</p>
          </div>
          <div className="transform transition-transform duration-300 hover:scale-110">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-[#0e7c85] to-cyan-600 rounded-full" />
      </div>

      {/* Timeline */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <OrderTimeline status={order.status} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Section */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="group bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 transition-all duration-300 hover:from-white/90 hover:to-white/60 hover:shadow-lg hover:shadow-cyan-200/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.unit_price)} × {item.quantity}
                      </p>
                      <p className="font-bold text-lg bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                        {formatCurrency(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              {(order.status === "pending" || order.status === "paid") && (
                <button
                  onClick={handleEditAddress}
                  className="text-sm px-3 py-1.5 bg-[#0e7c85]/10 text-[#0e7c85] font-semibold rounded-lg hover:bg-[#0e7c85]/20 transition-colors"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-200/20 transition-all duration-300">
              <p className="font-semibold text-gray-900">
                {order.shipping_address.street}
              </p>
              <p className="text-gray-600 mt-2">
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              </p>
              <p className="text-gray-600">
                {order.shipping_address.country}
              </p>
            </div>
          </div>

          {/* Edit Address Modal */}
          {isEditingAddress && editedAddress && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Shipping Address</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Street</label>
                    <input
                      type="text"
                      value={editedAddress.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                      <input
                        type="text"
                        value={editedAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
                      <input
                        type="text"
                        value={editedAddress.state}
                        onChange={(e) => handleAddressChange("state", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Zip Code</label>
                      <input
                        type="text"
                        value={editedAddress.zip}
                        onChange={(e) => handleAddressChange("zip", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
                      <input
                        type="text"
                        value={editedAddress.country}
                        onChange={(e) => handleAddressChange("country", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setIsEditingAddress(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    disabled={isSavingAddress}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 space-y-4 hover:shadow-lg hover:shadow-cyan-200/20 transition-all duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-white/40">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex items-center justify-between pb-4 border-b border-white/40 bg-gradient-to-r from-green-50 to-emerald-50/50 -mx-6 px-6 py-3 rounded-lg">
                  <div>
                    <span className="text-gray-600 block font-medium">Discount Applied</span>
                    {typeof order.coupon_id === "object" && order.coupon_id?.code && (
                      <span className="text-xs text-green-700 font-bold tracking-wider mt-1 block">
                        🎟️ COUPON: {order.coupon_id.code}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-green-600 text-lg">-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-200/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
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

          {/* Cancel Button */}
          {order.status === "pending" && (
            <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
              <button
                onClick={handleCancel}
                className="w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-300 active:scale-95"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
