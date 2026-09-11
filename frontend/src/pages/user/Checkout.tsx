import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services/orderService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import { redirectToEsewa } from "../../utils/esewaRedirect";
import { ROUTES } from "../../constants/routes";
import CouponInput from "../../components/coupon/CouponInput";
import type { ApplyCouponResult } from "../../types/coupon.types";
import type { Product } from "../../types/product.types";
import type { OrderShippingAddress, PaymentMethod } from "../../types/order.types";

const Checkout = () => {
  const { cart } = useCart();

  const [address, setAddress] = useState<OrderShippingAddress>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyCouponResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eafcfd] via-white to-cyan-50 flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center animate-fade-in">
          <div className="inline-block mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#0e7c85]/10 to-cyan-600/10">
            <p className="text-lg text-gray-600 font-medium">Your cart is empty</p>
          </div>
          <Link 
            to={ROUTES.PRODUCTS} 
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal - discount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await orderService.create({
        shipping_address: address,
        coupon_code: appliedCoupon?.code,
        payment_method: paymentMethod,
      });

      if (paymentMethod === "esewa" && response.esewa) {
        redirectToEsewa(response.esewa.fields, response.esewa.gatewayUrl);
        return;
      }

      window.location.href = ROUTES.ORDER_DETAIL(response.data._id);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#eafcfd] via-white to-cyan-50 py-8 sm:py-12 overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-br from-cyan-300/40 via-cyan-200/20 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-tr from-[#0e7c85]/30 via-teal-200/20 to-transparent rounded-full blur-3xl animate-float animation-delay-3000"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-full blur-3xl animate-float animation-delay-5000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 animate-fade-in">
        {/* Header - Enhanced */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100/60 to-teal-100/60 border border-cyan-200/40 backdrop-blur">
            <p className="text-xs sm:text-sm font-bold text-[#0e7c85] uppercase tracking-widest">✨ Secure Checkout</p>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[#0e7c85] via-cyan-600 to-teal-500 bg-clip-text text-transparent mb-3">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Fast, secure, and trusted checkout process</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-shake">
            <div className="rounded-2xl bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10 border-2 border-red-300/50 text-red-800 px-6 py-4 text-sm font-semibold shadow-xl backdrop-blur">
              <span className="inline-flex items-center gap-2"><span className="text-xl">⚠️</span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Shipping Address */}
            <div className="group relative rounded-3xl overflow-hidden animate-fade-in animation-delay-100 hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/80 via-white/70 to-teal-50/60 -z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-200/10 via-transparent to-teal-200/10 transition-opacity duration-500 -z-10"></div>
              
              <div className="relative p-7 sm:p-10 border border-cyan-200/60 group-hover:border-cyan-300/80 transition-all duration-300 rounded-3xl backdrop-blur-md">
                <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text mb-8 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-white font-bold text-lg shadow-lg">📍</span>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div className="relative group/input">
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white/80 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-transparent opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white/80 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white/80 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Zip Code"
                      required
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white/80 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      required
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white/80 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="group relative rounded-3xl overflow-hidden animate-fade-in animation-delay-200 hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/70 to-pink-50/60 -z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-200/10 via-transparent to-pink-200/10 transition-opacity duration-500 -z-10"></div>
              
              <div className="relative p-7 sm:p-10 border border-purple-200/60 group-hover:border-purple-300/80 transition-all duration-300 rounded-3xl backdrop-blur-md">
                <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-white font-bold text-lg shadow-lg">🎟️</span>
                  Apply Coupon
                </h2>
                <CouponInput orderAmount={subtotal} onApplied={setAppliedCoupon} />
                {appliedCoupon && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-green-100/80 via-emerald-100/60 to-green-50/80 border-2 border-green-300/60 animate-pulse-glow">
                    <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <span className="text-lg">✨</span>Coupon <span className="text-emerald-600 font-black">{appliedCoupon.code}</span> applied! You saved <span className="text-emerald-600 font-black">{formatCurrency(appliedCoupon.discount_amount)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="group relative rounded-3xl overflow-hidden animate-fade-in animation-delay-300 hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white/70 to-amber-50/60 -z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-orange-200/10 via-transparent to-amber-200/10 transition-opacity duration-500 -z-10"></div>
              
              <div className="relative p-7 sm:p-10 border border-orange-200/60 group-hover:border-orange-300/80 transition-all duration-300 rounded-3xl backdrop-blur-md">
                <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text mb-8 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-lg shadow-lg">💳</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* COD Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative group/btn rounded-2xl p-6 text-left transition-all duration-300 border-3 transform hover:scale-105 active:scale-95 ${
                      paymentMethod === "cod"
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-50 shadow-xl"
                        : "border-gray-300/50 bg-white/60 hover:border-cyan-400 hover:shadow-lg"
                    }`}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 ${paymentMethod === "cod" ? "opacity-5" : ""} transition-opacity -z-10`}></div>
                    <div className="text-3xl mb-2">💵</div>
                    <p className="font-bold text-base text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600 mt-2">Pay when your order arrives</p>
                  </button>

                  {/* eSewa Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("esewa")}
                    className={`relative group/btn rounded-2xl p-6 text-left transition-all duration-300 border-3 transform hover:scale-105 active:scale-95 ${
                      paymentMethod === "esewa"
                        ? "border-green-500 bg-gradient-to-br from-green-100 to-green-50 shadow-xl"
                        : "border-gray-300/50 bg-white/60 hover:border-green-400 hover:shadow-lg"
                    }`}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 ${paymentMethod === "esewa" ? "opacity-5" : ""} transition-opacity -z-10`}></div>
                    <div className="w-12 h-8 mb-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">e</span>
                    </div>
                    <p className="font-bold text-base text-gray-900">eSewa Payment</p>
                    <p className="text-sm text-gray-600 mt-2">Pay securely online</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 animate-fade-in animation-delay-400">
              <div className="group relative rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/80 via-white/80 to-teal-50/60 -z-10"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-200/15 via-transparent to-teal-200/15 transition-opacity duration-500 -z-10"></div>
                
                <div className="relative p-7 sm:p-8 border-3 border-cyan-200/70 group-hover:border-cyan-400 transition-all duration-300 rounded-3xl backdrop-blur-md">
                  <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text mb-8">
                    📦 Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6 pb-6 border-b-3 border-cyan-200/50">
                    {cart.items.map((item) => {
                      const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
                      if (!product) return null;
                      return (
                        <div key={product._id} className="flex justify-between text-sm group/item hover:bg-cyan-50/60 px-2 py-1.5 rounded-lg transition-all">
                          <span className="text-gray-800 font-semibold">{product.name}</span>
                          <span className="text-cyan-700 font-bold">{formatCurrency(product.price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 mb-6 pb-6 border-b-3 border-cyan-200/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-semibold">Subtotal</span>
                      <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm animate-pulse-glow">
                        <span className="text-emerald-700 font-black">Discount</span>
                        <span className="font-black text-emerald-600">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-cyan-200/40 to-teal-200/40 border-2 border-cyan-300/60">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-gray-900">Total</span>
                      <span className="text-4xl font-black bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative py-5 px-6 rounded-2xl font-black text-lg text-white overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0e7c85] via-cyan-600 to-teal-500 group-hover:from-[#0a5f68] group-hover:via-[#0a9db2] group-hover:to-[#16a596] transition-all duration-300 rounded-2xl"></div>
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                    </div>
                    <span className="relative flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <span className="inline-block w-5 h-5 border-3 border-white/40 border-t-white rounded-full animate-spin"></span>
                          {paymentMethod === "esewa" ? "Redirecting to eSewa..." : "Processing..."}
                        </>
                      ) : paymentMethod === "esewa" ? (
                        <>
                          <span>🚀 Pay with eSewa</span>
                        </>
                      ) : (
                        <>
                          <span>✅ Place Order</span>
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-xs text-gray-600 text-center mt-4 font-medium">🔒 PCI-DSS Compliant • SSL Encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-40px) rotate(0deg); }
          75% { transform: translateY(-20px) rotate(-5deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.8); }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-5000 { animation-delay: 5s; }
      `}</style>
    </div>
  );
};

export default Checkout;