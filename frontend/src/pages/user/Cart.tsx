import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routes";

const Cart = () => {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItem key={item._id || (typeof item.product_id === "object" ? item.product_id._id : item.product_id)} item={item} />
          ))}
        </div>

        <CartSummary cart={cart} />
      </div>
    </div>
  );
};

export default Cart;