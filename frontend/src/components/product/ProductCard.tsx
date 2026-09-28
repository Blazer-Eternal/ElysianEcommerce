import { Link } from "react-router-dom";
import { useState, memo } from "react";
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
  const { addItem } = useCartActions();
  const { ref } = useAnimationPause({ threshold: 0.05, rootMargin: "100px", pauseOnScroll: true });

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
        <div className="glass rounded-2xl overflow-hidden hover:bg-white/80 transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 gpu-accelerate" style={{ backfaceVisibility: "hidden" }}>
          {/* Image Container */}
          <div className="relative overflow-hidden bg-linear-to-br from-[#eafcfd] to-[#d7f4f6] aspect-square">
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
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
              <div className="glass rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                {outOfStock ? (
                  <span className="text-red-600">Out of Stock</span>
                ) : product.stock && product.stock < 5 ? (
                  <span className="text-orange-600">Only {product.stock} left</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </div>
              {discount > 0 && (
                <div className="rounded-full bg-[#0e7c85] px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                  {discount}% off
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 z-20">
              <div className="glass rounded-full p-2 backdrop-blur-md hover:bg-white/80 transition-all duration-300 flex items-center justify-center">
                <WishlistButton productId={product._id} />
              </div>
            </div>

            {/* Quick Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || isAdding}
              className={`absolute bottom-2 right-2 glass rounded-full p-2 backdrop-blur-md transition-all duration-300 flex items-center justify-center text-[#0e7c85] group-hover:bg-[#0e7c85] group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <AddToCartIcon />
            </button>
          </div>

          {/* Content Container */}
          <div className="flex-1 p-4 flex flex-col justify-between gap-3">
            {/* Product Name */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#0e7c85] transition-colors duration-300">
                {product.name}
              </h3>

              {/* Rating */}
              {product.rating_avg && product.rating_count > 0 ? (
                <div className="flex items-center gap-1.5">
                  <StarRating
                    value={product.rating_avg}
                    size={16}
                    filledClassName="text-[#0e7c85]"
                    emptyClassName="text-[#0e7c85]/30"
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
            <div className="pt-3 border-t border-white/40">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-extrabold text-[#0e7c85]">
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
              <p className="text-[11px] text-gray-500 mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || isAdding}
              className="w-full rounded-xl border border-[#0e7c85]/40 bg-white/70 px-3 py-2 text-sm font-bold text-[#0e7c85] transition-all duration-300 hover:bg-[#0e7c85] hover:border-[#0e7c85] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/70 disabled:hover:text-[#0e7c85]"
            >
              {isAdding ? "Adding..." : outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(ProductCard);
