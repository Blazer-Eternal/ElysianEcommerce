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
    <div className="border rounded-lg p-4 h-fit sticky top-20">
      <h2 className="font-semibold mb-3">Order Summary</h2>

      <div className="flex justify-between text-sm mb-2">
        <span>Items ({itemCount})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <p className="text-xs text-gray-500 mt-1">Shipping and coupon applied at checkout.</p>

      <Link
        to={ROUTES.CHECKOUT}
        className="block text-center bg-black text-white rounded py-2.5 mt-4 hover:bg-gray-800"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;
