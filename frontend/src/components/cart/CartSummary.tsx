import { Link } from "react-router-dom";
import type { Cart } from "../../types/cart.types";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  const subtotal = cart.items.reduce((sum, item) => {
    const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in h-fit sticky top-24">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eafcfd] via-white to-cyan-50 -z-10"></div>

      {/* Content */}
      <div className="relative p-5 border border-cyan-200/60 rounded-2xl bg-white/80 backdrop-blur-sm hover:border-cyan-300 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0e7c85]">
            Order Summary
          </h2>
          <div className="text-2xl">📦</div>
        </div>

        {/* Items breakdown */}
        <div className="space-y-2 mb-4 pb-4 border-b border-cyan-200/50">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cyan-50/50 transition-all duration-200">
            <span className="font-semibold text-gray-700 text-sm flex items-center gap-1.5">
              <span className="text-base">📊</span>
              Items
            </span>
            <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 bg-gradient-to-r from-cyan-100 to-teal-100 text-[#0e7c85] font-bold text-sm rounded-full border border-cyan-300/50">
              {itemCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cyan-50/50 transition-all duration-200">
            <span className="font-semibold text-gray-700 text-sm">Subtotal</span>
            <span className="text-base font-bold text-[#0e7c85]">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        {/* Info callout */}
        <div className="mb-4 p-2.5 rounded-lg bg-blue-50/80 border-l-3 border-cyan-400">
          <p className="text-xs text-gray-700 font-medium flex items-start gap-1.5">
            <span className="text-sm mt-0.5 flex-shrink-0">ℹ️</span>
            <span>Shipping costs & coupon discounts calculated at checkout</span>
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to={ROUTES.CHECKOUT}
          className="block w-full py-3 px-4 rounded-xl font-bold text-sm text-white text-center bg-gradient-to-r from-[#0e7c85] to-cyan-600 hover:from-[#0a5f68] hover:to-[#0a9db2] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          Proceed to Checkout
        </Link>

        {/* Footer badges */}
        <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold text-gray-600">
          <span className="flex items-center gap-0.5">
            <span>🔒</span>
            Secure
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-gray-400"></span>
          <span className="flex items-center gap-0.5">
            <span>⚡</span>
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
