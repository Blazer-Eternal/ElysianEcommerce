import { Link } from "react-router-dom";
import { InfoIcon, LockIcon, ZapIcon } from "../icons";
import { useAnimationPause } from "../../hooks/useAnimationPause";
import type { Cart } from "../../types/cart.types";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  const { ref } = useAnimationPause({ threshold: 0.05, rootMargin: "100px", pauseOnScroll: true });
  
  const subtotal = cart.items.reduce((sum, item) => {
    const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div 
      ref={ref}
      className="group rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(61,5,12,0.06)] hover:shadow-[0_8px_28px_rgba(61,5,12,0.12)] transition-all duration-500 animate-fade-in h-fit sticky top-24 animation-container gpu-accelerate"
      style={{ contain: "layout style paint", transform: "translateZ(0)" }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-50 via-white to-cyan-100 -z-10"></div>

      {/* Content */}
      <div className="relative p-5 border border-[#ece1d0] rounded-2xl bg-white hover:border-brand/30 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand">
            Order Summary
          </h2>
        </div>

        {/* Items breakdown */}
        <div className="space-y-2 mb-4 pb-4 border-b border-[#ece1d0]">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cyan-50/50 transition-all duration-200">
            <span className="font-semibold text-gray-700 text-sm">Items</span>
            <span className="inline-flex items-center justify-center min-w-7 h-7 bg-linear-to-r from-cyan-100 to-teal-100 text-brand font-bold text-sm rounded-full border border-cyan-300/50">
              {itemCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cyan-50/50 transition-all duration-200">
            <span className="font-semibold text-gray-700 text-sm">Subtotal</span>
            <span className="text-base font-bold text-brand">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        {/* Info callout */}
        <div className="mb-4 p-2.5 rounded-lg bg-cyan-50 border-l-3 border-cyan-400">
          <p className="text-xs text-gray-700 font-medium flex items-start gap-1.5">
            <InfoIcon size={14} className="mt-0.5 shrink-0" />
            <span>Shipping costs & coupon discounts calculated at checkout</span>
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to={ROUTES.CHECKOUT}
          className="block w-full py-3 px-4 rounded-xl font-bold text-sm text-white text-center bg-linear-to-r from-brand to-cyan-600 hover:from-brand-dark hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          Proceed to Checkout
        </Link>

        {/* Footer badges */}
        <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold text-gray-600">
          <span className="flex items-center gap-1">
            <LockIcon size={13} />
            Secure
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-cyan-300"></span>
          <span className="flex items-center gap-1">
            <ZapIcon size={13} />
            Fast
          </span>
        </div>
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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartSummary;
