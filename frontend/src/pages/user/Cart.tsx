import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Spinner from "../../components/ui/Spinner";
import { ROUTES } from "../../constants/routes";

const Cart = () => {
  const { cart, isLoading } = useCart();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eafcfd] via-white to-cyan-50">
        <div className="animate-fade-in">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#eafcfd] via-white to-cyan-50 flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center animate-fade-in w-full">
          
          {/* Empty Cart Icon and Message */}
          <div className="mb-12">
            <div className="inline-block mb-6 p-6 rounded-3xl bg-linear-to-r from-[#0e7c85]/10 to-cyan-600/10">
              <svg
                className="w-24 h-24 mx-auto text-[#0e7c85]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Your Cart is Empty
            </h2>

            <p className="text-lg text-gray-600 mb-2">
              Looks like you haven't added anything yet!
            </p>

            <p className="text-gray-500">
              Explore our amazing collection and find products you love.
            </p>
          </div>

          {/* Why Shop With Elysian */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Why shop with Elysian?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              
              {/* Premium Quality */}
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-[#0e7c85] rounded-full mr-2"></div>
                  <p className="font-semibold text-gray-700">
                    Premium Quality
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Curated products that meet our standards
                </p>
              </div>

              {/* Fast Delivery */}
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-[#0e7c85] rounded-full mr-2"></div>
                  <p className="font-semibold text-gray-700">
                    Fast Delivery
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Quick and secure delivery to your door
                </p>
              </div>

              {/* Best Prices */}
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-[#0e7c85] rounded-full mr-2"></div>
                  <p className="font-semibold text-gray-700">
                    Best Prices
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Competitive pricing with great discounts
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to={ROUTES.PRODUCTS}
              className="px-8 py-3 bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Start Shopping
            </Link>

            <Link
              to={ROUTES.HOME}
              className="px-8 py-3 bg-white text-[#0e7c85] font-semibold rounded-xl border-2 border-[#0e7c85] hover:bg-gray-50 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>

          {/* Contact */}
          <div className="text-sm text-gray-500">
            <p>
              Need help?{" "}
              <Link
                to={ROUTES.CONTACT}
                className="text-[#0e7c85] font-semibold hover:underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#eafcfd] via-white to-cyan-50 py-8 sm:py-12 overflow-hidden">
      
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        
        {/* Blob 1 */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-linear-to-br from-cyan-200/30 to-transparent rounded-full blur-3xl animate-pulse animation-delay-0"></div>

        {/* Blob 2 */}
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-bl from-[#0e7c85]/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

        {/* Blob 3 */}
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-linear-to-l from-cyan-300/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 animate-fade-in">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-[#0e7c85] via-cyan-600 to-teal-500 bg-clip-text text-transparent mb-2">
            Shopping Cart
          </h1>

          <p className="text-gray-600">
            Review and manage your selected items
          </p>
        </div>

        {/* Main Cart Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Cart Items Column */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Item Count */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">
                  Items in cart:
                </span>{" "}
                {cart.items.length}
              </p>
            </div>

            {/* Cart Items */}
            {cart.items.map((item, index) => (
              <div
                key={
                  item._id ||
                  (typeof item.product_id === "object"
                    ? item.product_id._id
                    : item.product_id)
                }
                style={{
                  animation: `slideInLeft 0.5s ease-out ${
                    index * 0.1
                  }s both`,
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

              {/* Shopping Tip */}
              <div className="mt-6 p-4 bg-linear-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  💡 SHOPPING TIP
                </p>

                <p className="text-sm text-gray-700">
                  Complete your order to enjoy fast delivery and exclusive
                  benefits!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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