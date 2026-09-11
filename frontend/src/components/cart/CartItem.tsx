import { useState } from "react";
import { Link } from "react-router-dom";
import type { CartItem as CartItemType } from "../../types/cart.types";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
  if (!product) return null;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    setIsUpdating(true);
    try {
      await updateItem(product._id, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(product._id);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
      isRemoving ? "animate-slide-out-left" : "animate-fade-in"
    }`}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/30 group-hover:from-white group-hover:via-cyan-50/60 group-hover:to-teal-50/50 transition-all duration-300 -z-10"></div>
      
      {/* Border gradient effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-300/20 via-transparent to-teal-300/20 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

      <div className="relative p-4 sm:p-6 border border-cyan-100/60 group-hover:border-cyan-200/80 transition-all duration-300 rounded-2xl shadow-sm group-hover:shadow-lg backdrop-blur-sm">
        
        <div className="flex gap-4 sm:gap-6">
          {/* Product Image */}
          <Link 
            to={ROUTES.PRODUCT_DETAIL(product._id)} 
            className="relative shrink-0 group/img"
          >
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl overflow-hidden border border-cyan-200/50 group-hover/img:border-cyan-400 transition-all duration-300">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Hover badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              👁️
            </div>
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link 
              to={ROUTES.PRODUCT_DETAIL(product._id)} 
              className="font-bold text-base sm:text-lg text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-600 hover:to-teal-600 hover:bg-clip-text transition-all duration-300 line-clamp-2"
            >
              {product.name}
            </Link>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-semibold rounded-full">
                In Stock
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 mt-4">
              <div className="inline-flex items-center gap-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full p-1 border border-gray-200/60 shadow-sm">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-teal-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-90"
                >
                  −
                </button>
                <span className="text-sm sm:text-base font-bold text-gray-900 w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= product.stock}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-teal-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-90"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="ml-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-md"
              >
                🗑️ Remove
              </button>
            </div>
          </div>

          {/* Price Total */}
          <div className="shrink-0 text-right">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Total</p>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-[#0e7c85] via-cyan-600 to-teal-500 bg-clip-text text-transparent">
              {formatCurrency(product.price * item.quantity)}
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <style>{`
        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
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

        .animate-slide-out-left {
          animation: slideOutLeft 0.4s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartItem;
