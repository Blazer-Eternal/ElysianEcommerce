import { useState, useMemo } from "react";
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
    className="text-amber-400"
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

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Wishlist = () => {
  const { items, isLoading } = useWishlist();
  const { addItem } = useCart();

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; message: string } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("newest");

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

  // Extract categories from items
  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
      if (product?.category_id) {
        const categoryName = typeof product.category_id === "object" ? product.category_id.name : product.category_id;
        cats.add(categoryName);
      }
    });
    return Array.from(cats);
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      if (selectedCategory === "all") return true;
      const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
      if (product?.category_id) {
        const categoryName = typeof product.category_id === "object" ? product.category_id.name : product.category_id;
        return categoryName === selectedCategory;
      }
      return false;
    });

    return filtered.sort((a, b) => {
      const productA = typeof a.product_id === "object" ? (a.product_id as Product) : null;
      const productB = typeof b.product_id === "object" ? (b.product_id as Product) : null;

      if (!productA || !productB) return 0;

      switch (sortBy) {
        case "price-low":
          return productA.price - productB.price;
        case "price-high":
          return productB.price - productA.price;
        case "rating":
          return (productB.rating_avg || 0) - (productA.rating_avg || 0);
        case "newest":
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
  }, [items, selectedCategory, sortBy]);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-8 animate-fade-in">
          {/* Animated Heart Icon */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-pink-500 animate-bounce" style={{ animationDelay: "0s" }}>
                <HeartIcon />
              </div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="text-4xl text-pink-500">♡</div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-cyan-600 bg-clip-text text-transparent">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Start building your collection! Explore our curated selection of premium products and add items you love.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              to={ROUTES.PRODUCTS}
              className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0e7c85] to-cyan-600 hover:from-[#0b6169] hover:to-cyan-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform active:scale-95"
            >
              Explore Products →
            </Link>
            <Link
              to={ROUTES.HOME}
              className="px-8 py-3.5 rounded-xl font-semibold text-[#0e7c85] bg-white/80 backdrop-blur-sm border border-cyan-200 hover:bg-white hover:border-cyan-400 transition-all duration-300 hover:shadow-lg"
            >
              Go Home
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { icon: "🎁", label: "Curated Selection" },
              { icon: "💰", label: "Best Prices" },
              { icon: "⚡", label: "Quick Checkout" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/80 hover:bg-white hover:border-cyan-200 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <p className="text-xs text-gray-600 font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8 sm:py-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 animate-fade-in">
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg">
              <HeartIcon />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-cyan-600 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1">
                {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total Items", value: items.length, icon: "📦", color: "from-blue-100 to-cyan-100" },
            { label: "Avg. Price", value: formatCurrency(items.reduce((sum, item) => {
              const product = typeof item.product_id === "object" ? item.product_id as Product : null;
              return sum + (product?.price || 0);
            }, 0) / items.length), icon: "💰", color: "from-emerald-100 to-teal-100" },
            { label: "Best Rated", value: Math.max(...items.map(item => {
              const product = typeof item.product_id === "object" ? item.product_id as Product : null;
              return product?.rating_avg || 0;
            })).toFixed(1), icon: "⭐", color: "from-amber-100 to-orange-100" },
            { label: "Value Potential", value: (items.length * 100).toString() + " pts", icon: "🎁", color: "from-pink-100 to-rose-100" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 hover:border-cyan-300 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-2 text-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Sort Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white shadow-lg -translate-y-0.5"
                  : "bg-white/50 backdrop-blur-sm border border-white/80 text-gray-700 hover:bg-white hover:border-cyan-300"
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white shadow-lg -translate-y-0.5"
                    : "bg-white/50 backdrop-blur-sm border border-white/80 text-gray-700 hover:bg-white hover:border-cyan-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-cyan-300 bg-white/70 backdrop-blur-sm text-gray-900 font-medium hover:border-cyan-500 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 auto-rows-max">
          {filteredAndSortedItems.map((item, index) => {
            const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
            if (!product) return null;

            const outOfStock = product.stock === 0;
            const isAdding = addingId === product._id;
            const justAdded = addedId === product._id;
            const itemError = errorId?.id === product._id ? errorId.message : null;
            const isHovered = hoveredId === product._id;
            const rating = Math.round(product.rating_avg || 0);
            const imageUrl = product.images?.[0] || "https://via.placeholder.com/400";
            const discountPercent = product.cost_price ? Math.round(((product.cost_price - product.price) / product.cost_price) * 100) : 0;

            return (
              <div
                key={item._id}
                onMouseEnter={() => setHoveredId(product._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group h-full animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 transform-gpu will-animate">
                  {/* Background Gradient Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  {/* Card Container */}
                  <div className="glass h-full rounded-2xl overflow-hidden hover:bg-white/90 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl border border-white/40 hover:border-cyan-200/60">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#eafcfd] via-[#d7f4f6] to-[#c5eef0] aspect-square group">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                      />

                      {/* Overlay Gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-opacity duration-300 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      />

                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 animate-bounce" style={{ animationDelay: "0s" }}>
                          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            -{discountPercent}%
                          </div>
                        </div>
                      )}

                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 glass rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/60">
                        {outOfStock ? (
                          <span className="text-red-600 font-bold">Out of Stock</span>
                        ) : product.stock && product.stock < 5 ? (
                          <span className="text-orange-600 font-bold flex items-center gap-1">
                            <TrendingIcon /> Only {product.stock}
                          </span>
                        ) : (
                          <span className="text-green-600 font-bold">✓ In Stock</span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <div className="absolute top-3 right-14 z-20 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                        <div className="glass rounded-full p-2.5 hover:bg-white/90 transition-all duration-300 backdrop-blur-md border border-white/60 hover:border-white hover:scale-110 cursor-pointer">
                          <WishlistButton productId={product._id} />
                        </div>
                      </div>

                      {/* Add to Cart Button - Floating */}
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={outOfStock || isAdding}
                        className={`absolute bottom-4 right-4 glass rounded-full p-3 transition-all duration-300 flex items-center justify-center text-white bg-gradient-to-r from-[#0e7c85] to-cyan-600 hover:from-[#0b6169] hover:to-cyan-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform will-animate group-hover:scale-110 ${
                          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                        title="Add to Cart"
                      >
                        <AddToCartIcon />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Product Name */}
                        <Link to={ROUTES.PRODUCT_DETAIL(product._id)}>
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-[#0e7c85] transition-colors duration-300 hover:underline decoration-cyan-400">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Product Description Preview */}
                        {product.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {product.description}
                          </p>
                        )}

                        {/* Rating Section */}
                        {product.rating_avg && (
                          <div className="flex items-center gap-2 pt-1">
                            <div className="flex gap-0.5 group-hover:scale-110 transition-transform duration-300">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                  <StarIcon filled={i < rating} />
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {(product.rating_avg || 0).toFixed(1)} ({product.rating_count || 0})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Price & Action Section */}
                      <div className="pt-4 border-t border-gradient-to-r from-transparent via-cyan-200/30 to-transparent mt-4 space-y-3">
                        {/* Price Display */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">
                            {formatCurrency(product.price)}
                          </span>
                          {product.cost_price && product.cost_price > product.price && (
                            <span className="text-xs text-gray-500 line-through font-medium">
                              {formatCurrency(product.cost_price)}
                            </span>
                          )}
                        </div>

                        {/* Error Message */}
                        {itemError && (
                          <div className="p-2 bg-red-50/80 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-700 font-medium">{itemError}</p>
                          </div>
                        )}

                        {/* Add to Cart Button - Full Width */}
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={outOfStock || isAdding}
                          className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0e7c85] to-cyan-600 text-white hover:from-[#0b6169] hover:to-cyan-700 hover:shadow-lg hover:-translate-y-0.5 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 transform active:scale-95"
                        >
                          <AddToCartIcon />
                          {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "✓ Added!" : "Add to Cart"}
                        </button>

                        {/* Secondary Action */}
                        <Link
                          to={ROUTES.PRODUCT_DETAIL(product._id)}
                          className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center text-[#0e7c85] border border-cyan-300 bg-white/50 hover:bg-white hover:border-cyan-500 hover:shadow-md"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA Section */}
      {filteredAndSortedItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pt-12">
          <div className="bg-gradient-to-r from-cyan-100/50 via-blue-100/30 to-cyan-100/50 rounded-2xl p-8 sm:p-12 backdrop-blur-sm border border-white/60 shadow-lg text-center space-y-4 animate-fade-in">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Ready to upgrade your style?</h3>
            <p className="text-gray-700 max-w-lg mx-auto">
              You have {filteredAndSortedItems.length} amazing items in your wishlist. Start your shopping journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  const firstProduct = filteredAndSortedItems[0];
                  if (firstProduct) {
                    const product = typeof firstProduct.product_id === "object" ? firstProduct.product_id as Product : null;
                    if (product) handleAddToCart(product._id);
                  }
                }}
                className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0e7c85] to-cyan-600 hover:from-[#0b6169] hover:to-cyan-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Quick Add First Item
              </button>
              <Link
                to={ROUTES.PRODUCTS}
                className="px-8 py-3 rounded-xl font-semibold text-[#0e7c85] bg-white hover:bg-gray-50 border border-cyan-300 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* No items after filter */}
      {filteredAndSortedItems.length === 0 && items.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="space-y-4">
            <p className="text-xl text-gray-600">No items in {selectedCategory} category</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-2.5 rounded-lg font-semibold text-[#0e7c85] bg-white border border-cyan-300 hover:bg-cyan-50 transition-all duration-300"
            >
              View All Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
