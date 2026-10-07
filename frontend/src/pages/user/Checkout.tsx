import { useState, type FormEvent } from "react";
import { AlertIcon, BanknoteIcon, CheckIcon, CreditCardIcon, MapPinIcon, TicketIcon } from "../../components/icons";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCartState } from "../../hooks/useCart";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import { redirectToEsewa } from "../../utils/esewaRedirect";
import { ROUTES } from "../../constants/routes";
import Spinner from "../../components/ui/Spinner";
import CouponInput from "../../components/coupon/CouponInput";
import type { ApplyCouponResult } from "../../types/coupon.types";
import type { Product } from "../../types/product.types";
import type { OrderShippingAddress, PaymentMethod } from "../../types/order.types";

/** One line shown in the order summary: a product plus how many are being bought. */
interface CheckoutLine {
  product: Product;
  quantity: number;
}

const Checkout = () => {
  const { cart } = useCartState();
  const [searchParams] = useSearchParams();

  // Buy Now arrives as /checkout?buyNow=<productId>&qty=<n>. The item is
  // ordered straight from here, so it is never placed in the cart.
  const buyNowProductId = searchParams.get("buyNow");
  const isBuyNow = Boolean(buyNowProductId);
  const parsedQty = Number.parseInt(searchParams.get("qty") ?? "1", 10);
  const buyNowQuantity = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1;

  const {
    data: buyNowData,
    isLoading: isBuyNowLoading,
    isError: isBuyNowError,
  } = useQuery({
    queryKey: ["product", buyNowProductId],
    queryFn: ({ signal }) => productService.getById(buyNowProductId as string, { signal }),
    enabled: isBuyNow,
    staleTime: 60_000,
  });

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

  const buyNowProduct = isBuyNow ? buyNowData?.data ?? null : null;

  if (isBuyNow && isBuyNowLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-cyan-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isBuyNow && (isBuyNowError || !buyNowProduct)) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-cyan-100 flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center animate-fade-in">
          <div className="inline-block mb-6 p-4 rounded-2xl bg-linear-to-r from-red-500/10 to-red-400/10">
            <p className="text-lg text-gray-600 font-medium">
              We couldn&apos;t find the product you wanted to buy.
            </p>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-block px-8 py-3 bg-linear-to-r from-brand to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!isBuyNow && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-cyan-100 flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center animate-fade-in">
          <div className="inline-block mb-6 p-4 rounded-2xl bg-linear-to-r from-brand/10 to-cyan-600/10">
            <p className="text-lg text-gray-600 font-medium">Your cart is empty</p>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-block px-8 py-3 bg-linear-to-r from-brand to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Buy Now orders are built from the query string, cart checkouts from the cart.
  const lines: CheckoutLine[] = isBuyNow
    ? [{ product: buyNowProduct as Product, quantity: buyNowQuantity }]
    : (cart?.items ?? [])
      .map((item) => ({
        product: typeof item.product_id === "object" ? item.product_id : null,
        quantity: item.quantity,
      }))
      .filter((line): line is CheckoutLine => line.product !== null);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const exceedsStock = lines.some((line) => line.quantity > line.product.stock);

  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal - discount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (exceedsStock) {
      setError("The requested quantity is more than what is left in stock.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await orderService.create({
        shipping_address: address,
        coupon_code: appliedCoupon?.code,
        payment_method: paymentMethod,
        // Buy Now only: order these lines directly and leave the cart alone.
        items: isBuyNow
          ? lines.map((line) => ({
            product_id: line.product._id,
            quantity: line.quantity,
          }))
          : undefined,
      });

      // COD, order created, cart already cleared by backend, redirect to order detail
      if (paymentMethod === "cod") {
        if (response.data?._id) {
          window.location.assign(ROUTES.ORDER_DETAIL(response.data._id));
        }
        return;
      }

      // eSewa, store preOrderToken and redirect to eSewa payment
      // Cart is NOT cleared yet - only cleared after payment verification
      if (paymentMethod === "esewa" && response.preOrderToken && response.esewa) {
        sessionStorage.setItem("esewaPreOrderToken", response.preOrderToken);
        redirectToEsewa(response.esewa.fields, response.esewa.gatewayUrl);
        return;
      }

      setError("Unexpected response from server");
      setIsSubmitting(false);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-cyan-50 via-white to-cyan-100 py-8 sm:py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
      </div>

      <div className="max-w-5xl mx-auto px-4 animate-fade-in">
        {/* Header - Enhanced */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-linear-to-r from-cyan-100/60 to-teal-100/60 border border-cyan-200/40">
            <p className="text-xs sm:text-sm font-bold text-brand uppercase tracking-widest">Secure Checkout</p>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-3 text-brand">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Delivery details first, then payment, cash on delivery or eSewa.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-shake">
            <div className="rounded-2xl bg-linear-to-r from-red-500/10 via-red-400/5 to-red-500/10 border-2 border-red-300/50 text-red-800 px-6 py-4 text-sm font-semibold shadow-md">
              <span className="inline-flex items-center gap-2"><AlertIcon size={18} className="shrink-0" />{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Shipping Address */}
            <div className="group relative rounded-2xl overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-50/80 via-white/70 to-teal-50/60 -z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-br from-cyan-200/10 via-transparent to-teal-200/10 transition-opacity duration-500 -z-10"></div>

              <div className="relative p-7 sm:p-10 border border-[#ece1d0] group-hover:border-brand/30 transition-all duration-300 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand text-white shadow-lg"><MapPinIcon size={20} /></span>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div className="relative group/input">
                    <input
                      id="street"
                      name="street"
                      type="text"
                      aria-label="Street Address"
                      autoComplete="street-address"
                      placeholder="Street Address"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-400/0 via-cyan-400/0 to-transparent opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      aria-label="City"
                      autoComplete="address-level2"
                      placeholder="City"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                    <input
                      id="state"
                      name="state"
                      type="text"
                      aria-label="State"
                      autoComplete="address-level1"
                      placeholder="State"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      aria-label="Zip Code"
                      autoComplete="postal-code"
                      placeholder="Zip Code"
                      required
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                    <input
                      id="country"
                      name="country"
                      type="text"
                      aria-label="Country"
                      autoComplete="country-name"
                      placeholder="Country"
                      required
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="border-2 border-cyan-200/50 rounded-2xl px-5 py-4 text-base bg-white focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200/30 transition-all duration-300 placeholder-gray-400 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="group relative rounded-2xl overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-50/80 via-white/70 to-cyan-50/60 -z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-br from-cyan-100/60 via-transparent to-cyan-100/40 transition-opacity duration-500 -z-10"></div>

              <div className="relative p-7 sm:p-10 border border-[#ece1d0] group-hover:border-brand/30 transition-all duration-300 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand text-white shadow-lg"><TicketIcon size={20} /></span>
                  Apply Coupon
                </h2>
                <CouponInput
                  orderAmount={subtotal}
                  items={lines.map((line) => ({ product_id: line.product._id, quantity: line.quantity }))}
                  onApplied={setAppliedCoupon}
                />
                {appliedCoupon && (
                  <div className="mt-5 p-4 rounded-2xl bg-green-50 border border-green-200">
                    <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <CheckIcon size={16} className="shrink-0" />Coupon <span className="text-emerald-700 font-black">{appliedCoupon.code}</span> applied! You saved <span className="text-emerald-700 font-black">{formatCurrency(appliedCoupon.discount_amount)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="group relative rounded-2xl overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-50/80 via-white/70 to-cyan-50/60 -z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-br from-cyan-100/60 via-transparent to-cyan-100/40 transition-opacity duration-500 -z-10"></div>

              <div className="relative p-7 sm:p-10 border border-[#ece1d0] group-hover:border-brand/30 transition-all duration-300 rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand text-white shadow-lg"><CreditCardIcon size={20} /></span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* COD Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative group/btn rounded-2xl p-6 text-left transition-all duration-300 border-2 transform hover:scale-105 active:scale-95 ${paymentMethod === "cod"
                        ? "border-brand bg-brand/5 shadow-md"
                        : "border-[#ece1d0] bg-white hover:border-brand/60 hover:shadow-lg"
                      }`}
                  >
                    <BanknoteIcon size={28} className="mb-2 text-gray-600" />
                    <p className="font-bold text-base text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600 mt-2">Pay when your order arrives</p>
                  </button>

                  {/* eSewa Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("esewa")}
                    className={`relative group/btn rounded-2xl p-6 text-left transition-all duration-300 border-3 transform hover:scale-105 active:scale-95 ${paymentMethod === "esewa"
                        ? "border-green-500 bg-linear-to-br from-green-100 to-green-50 shadow-md"
                        : "border-[#ece1d0] bg-white hover:border-green-400 hover:shadow-lg"
                      }`}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-r from-green-400 to-emerald-400 opacity-0 ${paymentMethod === "esewa" ? "opacity-5" : ""} transition-opacity -z-10`}></div>
                    <div className="w-12 h-8 mb-2 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
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
            <div className="sticky top-24 animate-fade-in">
              <div className="group relative rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-100/80 via-white/80 to-teal-50/60 -z-10"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-br from-cyan-200/15 via-transparent to-teal-200/15 transition-opacity duration-500 -z-10"></div>

                <div className="relative p-7 sm:p-8 border-3 border-[#ece1d0] group-hover:border-brand/30 transition-all duration-300 rounded-2xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6 pb-6 border-b-3 border-cyan-200/50">
                    {lines.map((line) => (
                      <div key={line.product._id} className="flex justify-between text-sm group/item hover:bg-cyan-50/60 px-2 py-1.5 rounded-lg transition-all">
                        <span className="text-gray-800 font-semibold">
                          {line.product.name}
                          {line.quantity > 1 && (
                            <span className="text-gray-500 font-medium"> × {line.quantity}</span>
                          )}
                        </span>
                        <span className="text-cyan-700 font-bold">{formatCurrency(line.product.price * line.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {exceedsStock && (
                    <div className="mb-6 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
                      Not enough stock: only {Math.min(...lines.map((l) => l.product.stock))} left.
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="space-y-3 mb-6 pb-6 border-b-3 border-cyan-200/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-semibold">Subtotal</span>
                      <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm ">
                        <span className="text-emerald-700 font-black">Discount</span>
                        <span className="font-black text-emerald-600">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total, label sits above the amount and both hug the same right edge as the
                      rows above, so a long NPR figure (Rs. 2,14,000) never wraps inside this
                      narrow summary column the way it did on one crowded line. */}
                  <div className="mb-8 p-5 rounded-2xl bg-linear-to-r from-cyan-200/40 to-teal-200/40 border-2 border-cyan-300/60">
                    <div className="flex flex-col items-end text-right">
                      <span className="text-xs font-black uppercase tracking-widest text-brand">
                        Total
                      </span>
                      <span className="mt-1 text-2xl font-black leading-none whitespace-nowrap tracking-tight text-brand">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || exceedsStock}
                    className="w-full relative py-5 px-6 rounded-2xl font-black text-lg text-white overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-brand via-cyan-600 to-teal-500 group-hover:from-[#8d1222] group-hover:via-cyan-600 group-hover:to-teal-700 transition-all duration-300 rounded-2xl"></div>
                    <span className="relative flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <span className="inline-block w-5 h-5 border-3 border-white/40 border-t-white rounded-full animate-spin"></span>
                          {paymentMethod === "esewa" ? "Redirecting to eSewa..." : "Processing..."}
                        </>
                      ) : paymentMethod === "esewa" ? (
                        <span>Pay with eSewa</span>
                      ) : (
                        <span>Place Order</span>
                      )}
                    </span>
                  </button>

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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

      `}</style>
    </div>
  );
};

export default Checkout;