import { Link } from "react-router-dom";
import { useState, useEffect, useRef, memo } from "react";
import type { Product } from "../../types/product.types";
import { formatCurrency, formatDiscount, getDisplayMrp } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";
import { useCartActions } from "../../hooks/useCart";
import { useAnimationPause } from "../../hooks/useAnimationPause";
import WishlistButton from "../wishlist/WishlistButton";
import StarRating from "../ui/StarRating";
import { cloudinaryImg } from "../../utils/imageUrl";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addItem } = useCartActions();
  const { ref } = useAnimationPause({ threshold: 0.05, rootMargin: "100px", pauseOnScroll: true });

  // Clear any pending success-message timer when the card unmounts.
  useEffect(
    () => () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    },
    []
  );

  const outOfStock = product.stock === 0;
  const imageUrl = product.images?.[0] || "/placeholder.svg";

  // MRP is the struck-through original price; cost_price only counts as MRP when it
  // is above the selling price (otherwise it is an internal cost, not a discount).
  const mrp = getDisplayMrp(product);
  const discount = formatDiscount(product.price, mrp);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem(product._id, 1);
      setJustAdded(true);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setJustAdded(false), 3000);
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
    >
      <div
        ref={ref}
        className="animation-container gpu-accelerate h-full"
        style={{ contain: "layout style paint", transform: "translateZ(0)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="glass rounded-2xl overflow-hidden hover:bg-white transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 gpu-accelerate" style={{ backfaceVisibility: "hidden" }}>
          {/* Image Container */}
          <div className="relative overflow-hidden bg-linear-to-br from-cyan-50 to-[#f7ecdb] aspect-square">
            {/* Product Image */}
            <img
              src={cloudinaryImg(imageUrl, 800)}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 gpu-accelerate"
              loading="lazy"
              decoding="async"
              style={{ transform: "translateZ(0)", willChange: "transform" }}
            />

            {/* Overlay on hover */}
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/40 to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Stock Badge */}
            <div className="absolute top-2 left-2">
              <div className="glass rounded-full px-2.5 py-1 text-xs font-semibold">
                {outOfStock ? (
                  <span className="text-red-600">Out of Stock</span>
                ) : product.stock && product.stock < 5 ? (
                  <span className="text-orange-600">Only {product.stock} left</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </div>
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 z-20">
              <div className="glass rounded-full p-2 hover:bg-white transition-all duration-300 flex items-center justify-center">
                <WishlistButton productId={product._id} />
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1 p-4 flex flex-col justify-between gap-3">
            {/* Product Name */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-brand transition-colors duration-300">
                {product.name}
              </h3>

              {/* Rating */}
              {product.rating_avg && product.rating_count > 0 ? (
                <div className="flex items-center gap-1.5">
                  <StarRating
                    value={product.rating_avg}
                    size={16}
                    filledClassName="text-brand"
                    emptyClassName="text-brand/30"
                  />
                  <span className="text-xs text-gray-600">
                    Ratings {product.rating_count}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-gray-500 font-medium">
                  No reviews yet
                </div>
              )}
            </div>

            {/* Price Container */}
            <div className="pt-3 border-t border-[#ece1d0]">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-extrabold text-brand">
                  {formatCurrency(product.price)}
                </span>
                {mrp && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(mrp)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-green-600">-{discount}%</span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="relative">
              {/* Success feedback */}
              {justAdded && (
                <div
                  role="status"
                  className="absolute bottom-full left-0 right-0 z-20 mb-2 flex items-center justify-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-2.5 py-1.5 text-center text-xs font-bold text-green-700 shadow-md animate-scale-in"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-green-600" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Successfully added to cart</span>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={outOfStock || isAdding}
                className={`w-full rounded-xl border px-3 py-2 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  justAdded
                    ? "border-green-500 bg-green-600 text-white disabled:hover:bg-green-600 disabled:hover:text-white"
                    : "border-brand/40 bg-white text-brand hover:bg-brand hover:border-brand hover:text-white disabled:hover:bg-white disabled:hover:text-brand"
                }`}
              >
                {isAdding
                  ? "Adding..."
                  : outOfStock
                  ? "Out of Stock"
                  : justAdded
                  ? "✓ Added!"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(ProductCard);
