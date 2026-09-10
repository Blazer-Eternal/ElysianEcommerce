import { Link } from "react-router-dom";
import { useState, memo } from "react";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";
import { useCart } from "../../hooks/useCart";
import WishlistButton from "../wishlist/WishlistButton";

interface ProductCardProps {
  product: Product;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className="text-[#0e7c85]"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const AddToCartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const outOfStock = product.stock === 0;
  const rating = Math.round(product.rating_avg || 0);
  const imageUrl = product.images?.[0] || "https://via.placeholder.com/400";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem(product._id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL(product._id)}
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass rounded-2xl overflow-hidden hover:bg-white/80 transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-linear-to-br from-[#eafcfd] to-[#d7f4f6] aspect-square">
          {/* Product Image */}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-linear-to-t from-black/40 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Stock Badge */}
          <div className="absolute top-3 left-3 glass rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
            {outOfStock ? (
              <span className="text-red-600">Out of Stock</span>
            ) : product.stock && product.stock < 5 ? (
              <span className="text-orange-600">Only {product.stock} left</span>
            ) : (
              <span className="text-green-600">In Stock</span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 z-20">
            <div className="glass rounded-full p-2.5 backdrop-blur-md hover:bg-white/80 transition-all duration-300 flex items-center justify-center">
              <WishlistButton productId={product._id} />
            </div>
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || isAdding}
            className={`absolute bottom-3 right-3 glass rounded-full p-2.5 backdrop-blur-md transition-all duration-300 flex items-center justify-center text-[#0e7c85] group-hover:bg-[#0e7c85] group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <AddToCartIcon />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          {/* Product Name */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-[#0e7c85] transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating_avg && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      <StarIcon filled={i < rating} />
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({product.rating_count || 0} {product.rating_count === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          {/* Price Container */}
          <div className="pt-3 border-t border-white/40 mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                {formatCurrency(product.price)}
              </span>
              {product.cost_price && product.cost_price < product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.cost_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(ProductCard);
