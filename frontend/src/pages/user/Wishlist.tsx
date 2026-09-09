import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import Spinner from "../../components/ui/Spinner";
import WishlistButton from "../../components/wishlist/WishlistButton";

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

const Wishlist = () => {
  const { items, isLoading } = useWishlist();
  const { addItem } = useCart();

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; message: string } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAddToCart = async (productId: string) => {
    setErrorId(null);
    setAddingId(productId);
    try {
      await addItem(productId, 1);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2000);
    } catch (err) {
      setErrorId({ id: productId, message: getErrorMessage(err) });
    } finally {
      setAddingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-600 mb-4 text-lg">Your wishlist is empty.</p>
        <Link to={ROUTES.PRODUCTS} className="text-[#0e7c85] font-semibold hover:text-[#0b6169]">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          My <span className="bg-linear-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Wishlist</span>
        </h1>
        <p className="text-gray-600 text-lg">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => {
            const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
            if (!product) return null;

            const outOfStock = product.stock === 0;
            const isAdding = addingId === product._id;
            const justAdded = addedId === product._id;
            const itemError = errorId?.id === product._id ? errorId.message : null;
            const isHovered = hoveredId === product._id;
            const rating = Math.round(product.rating_avg || 0);
            const imageUrl = product.images?.[0] || "https://via.placeholder.com/400";

            return (
              <div
                key={item._id}
                onMouseEnter={() => setHoveredId(product._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group h-full"
              >
                <div className="glass rounded-2xl overflow-hidden hover:bg-white/80 transition-all duration-300 h-full flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-linear-to-br from-[#eafcfd] to-[#d7f4f6] aspect-square">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-linear-to-t from-black/40 to-transparent transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3 glass rounded-full px-3 py-1.5 text-xs font-semibold">
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
                      <div className="glass rounded-full p-2.5 hover:bg-white/80 transition-all duration-300">
                        <WishlistButton productId={product._id} />
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={outOfStock || isAdding}
                      className={`absolute bottom-3 right-3 glass rounded-full p-2.5 transition-all duration-300 flex items-center justify-center text-[#0e7c85] group-hover:bg-[#0e7c85] group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      <AddToCartIcon />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <Link to={ROUTES.PRODUCT_DETAIL(product._id)}>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-[#0e7c85] transition-colors duration-300">
                          {product.name}
                        </h3>
                      </Link>

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
                            ({product.rating_count || 0})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & Button */}
                    <div className="pt-3 border-t border-white/40 mt-3 space-y-3">
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

                      {itemError && <p className="text-xs text-red-600">{itemError}</p>}

                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={outOfStock || isAdding}
                        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-linear-to-r from-[#0e7c85] to-cyan-600 text-white hover:from-[#0b6169] hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <AddToCartIcon />
                        {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
