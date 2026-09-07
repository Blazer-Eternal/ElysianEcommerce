import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services/orderService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";
import CouponInput from "../../components/coupon/CouponInput";
import type { ApplyCouponResult } from "../../types/coupon.types";
import type { Product } from "../../types/product.types";
import type { OrderShippingAddress } from "../../types/order.types";

const Checkout = () => {
  const { cart, refetch: refetchCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState<OrderShippingAddress>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyCouponResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to={ROUTES.PRODUCTS} className="underline">
          Browse Products
        </Link>
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
      });
      await refetchCart();
      navigate(ROUTES.ORDER_DETAIL(response.data._id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && <div className="mb-4 rounded bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-semibold">Shipping Address</h2>

          <input
            type="text"
            placeholder="Street"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="State"
              required
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Zip"
              required
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Country"
              required
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <h2 className="font-semibold pt-4">Coupon</h2>
          <CouponInput orderAmount={subtotal} onApplied={setAppliedCoupon} />
        </div>

        <div>
          <h2 className="font-semibold mb-3">Order Summary</h2>

          <div className="border rounded-lg divide-y">
            {cart.items.map((item) => {
              const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
              if (!product) return null;
              return (
                <div key={product._id} className="flex justify-between px-3 py-2 text-sm">
                  <span>
                    {product.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(product.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white rounded py-2.5 mt-6 disabled:opacity-50"
          >
            {isSubmitting ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;