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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eafcfd] via-white to-cyan-50">
        <div className="animate-fade-in">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#eafcfd] via-white to-cyan-50 py-8 sm:py-12 overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-transparent rounded-full blur-3xl animate-pulse animation-delay-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-[#0e7c85]/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-gradient-to-l from-cyan-300/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 animate-fade-in">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#0e7c85] via-cyan-600 to-teal-500 bg-clip-text text-transparent mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">Review and manage your selected items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items Column */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            {cart.items.map((item, index) => (
              <div 
                key={item._id || (typeof item.product_id === "object" ? item.product_id._id : item.product_id)}
                style={{
                  animation: `slideInLeft 0.5s ease-out ${index * 0.1}s both`,
                }}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>

          {/* Cart Summary Column */}
          <div className="md:col-span-1 animate-fade-in animation-delay-300">
            <div className="sticky top-24">
              <CartSummary cart={cart} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animation-delay-0 {
          animation-delay: 0s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Cart;
