import { useState, useMemo } from "react";
import { CoinsIcon, GiftIcon, HeartIcon, ZapIcon } from "../../components/icons";
import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCartActions } from "../../hooks/useCart";
import type { Product } from "../../types/product.types";
import { formatCurrency, formatDiscount, getDisplayMrp } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import Spinner from "../../components/ui/Spinner";
import StarRating from "../../components/ui/StarRating";
import WishlistButton from "../../components/wishlist/WishlistButton";
import ViewToggle, { type ViewMode } from "../../components/ui/ViewToggle";
import { cloudinaryImg } from "../../utils/imageUrl";

const TrendingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Wishlist = () => {
  const { items, isLoading } = useWishlist();
  const { addItem } = useCartActions();

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; message: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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
    const filtered = items.filter((item) => {
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
      <div className="min-h-screen bg-linear-to-br from-cream via-white to-cyan-100 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-8 animate-fade-in">
          {/* Animated Heart Icon */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center text-brand ">
                <HeartIcon />
              </div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="text-4xl text-brand">♡</div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Tap the heart on any product to save it here, then move it to your cart when you are
              ready to buy.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              to={ROUTES.PRODUCTS}
              className="px-8 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-brand to-cyan-600 hover:from-brand-dark hover:to-cyan-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform active:scale-95"
            >
              Explore Products →
            </Link>
            <Link
              to={ROUTES.HOME}
              className="px-8 py-3.5 rounded-xl font-semibold text-brand bg-white border border-brand/30 hover:bg-brand/5 hover:border-brand/50 transition-all duration-300 hover:shadow-lg"
            >
              Go Home
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { icon: <GiftIcon size={22} />, label: "Curated Selection" },
              { icon: <CoinsIcon size={22} />, label: "Best Prices" },
              { icon: <ZapIcon size={22} />, label: "Quick Checkout" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white border border-[#ece1d0] hover:bg-white hover:border-brand/40 transition-all duration-300 group cursor-pointer"
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
    <div className="min-h-screen bg-linear-to-br from-cream via-white to-cyan-100 py-8 sm:py-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 animate-fade-in">
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand/10 rounded-lg">
              <HeartIcon />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                My Wishlist
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-0.5">
                {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-linear-to-r from-brand to-cyan-600 text-white shadow-lg -translate-y-0.5"
                  : "bg-white border border-[#ece1d0] text-gray-700 hover:bg-white hover:border-brand/40"
              }`}
            >
              All Items
            </button>

            {/* Grid / List toggle — immediately right of "All Items" */}
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-brand to-cyan-600 text-white shadow-lg -translate-y-0.5"
                    : "bg-white border border-[#ece1d0] text-gray-700 hover:bg-white hover:border-brand/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            id="wishlist-sort"
            name="sort"
            aria-label="Sort wishlist"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-[#ece1d0] bg-white text-gray-900 font-medium hover:border-brand/40 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products — Grid / List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            {filteredAndSortedItems.map((item) => {
              const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
              if (!product) return null;

              const outOfStock = product.stock === 0;
              const isAdding = addingId === product._id;
              const justAdded = addedId === product._id;
              const itemError = errorId?.id === product._id ? errorId.message : null;
              const imageUrl = product.images?.[0] || "/placeholder.svg";

              return (
                <div key={item._id} className="group h-full animate-fade-in">
                  <div className="h-full rounded-2xl overflow-hidden bg-white transition-all duration-300 flex flex-col shadow-md hover:shadow-xl border border-[#ece1d0] hover:border-brand/40 hover:-translate-y-1 transform-gpu will-animate">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-linear-to-br from-[#fdf8f0] via-[#f7ecdb] to-[#f2e2cc] aspect-4/3 group">
                      <img
                        src={cloudinaryImg(imageUrl, 640)}
                        alt={product.name}
                        width={640}
                        height={480}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 will-change-transform"
                      />

                      {/* Stock Badge */}
                      <div className="absolute top-2 left-2 glass rounded-full px-2 py-1 text-[11px] font-semibold border border-[#ece1d0]">
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

                      {/* Wishlist Button — always visible */}
                      <div className="absolute top-2 right-2 z-20">
                        <div className="glass rounded-full p-1.5 hover:bg-white transition-all duration-300 border border-[#ece1d0] hover:border-brand/40 hover:scale-110">
                          <WishlistButton productId={product._id} />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      {/* Product Name */}
                      <Link to={ROUTES.PRODUCT_DETAIL(product._id)}>
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-brand transition-colors duration-300">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating Section */}
                      {product.rating_avg > 0 && product.rating_count > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <StarRating
                            value={product.rating_avg}
                            size={13}
                            filledClassName="text-amber-400"
                            emptyClassName="text-gray-300"
                          />
                          <span className="text-[11px] text-gray-600 font-medium">
                            {product.rating_avg.toFixed(1)} ({product.rating_count})
                          </span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-500 font-medium">No reviews yet</div>
                      )}

                      {/* Price Display */}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-lg font-bold text-brand">
                          {formatCurrency(product.price)}
                        </span>
                        {getDisplayMrp(product) && (
                          <span className="text-[11px] text-gray-500 line-through font-medium">
                            {formatCurrency(getDisplayMrp(product) as number)}
                          </span>
                        )}
                        {formatDiscount(product.price, getDisplayMrp(product)) > 0 && (
                          <span className="text-[11px] font-bold text-green-600">
                            -{formatDiscount(product.price, getDisplayMrp(product))}%
                          </span>
                        )}
                      </div>

                      {/* Error Message */}
                      {itemError && (
                        <div className="p-1.5 bg-red-50/80 border border-red-200 rounded-lg">
                          <p className="text-[11px] text-red-700 font-medium">{itemError}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto pt-1.5 flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={outOfStock || isAdding}
                          className="flex-1 py-2 rounded-lg font-semibold text-xs transition-all duration-300 bg-linear-to-r from-brand to-cyan-600 text-white hover:from-brand-dark hover:to-cyan-700 hover:shadow-md disabled:from-cream-deep disabled:to-cream-deep disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none transform active:scale-95"
                        >
                          {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "✓ Added!" : "Add to Cart"}
                        </button>
                        <Link
                          to={ROUTES.PRODUCT_DETAIL(product._id)}
                          className="px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 text-brand border border-brand/30 bg-white hover:bg-brand/5 hover:border-brand/50"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedItems.map((item) => {
              const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
              if (!product) return null;

              const outOfStock = product.stock === 0;
              const isAdding = addingId === product._id;
              const justAdded = addedId === product._id;
              const itemError = errorId?.id === product._id ? errorId.message : null;
              const imageUrl = product.images?.[0] || "/placeholder.svg";

              return (
                <div
                  key={item._id}
                  className="group flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-xl border border-[#ece1d0] shadow-sm hover:shadow-md hover:border-brand/40 transition-all duration-300 animate-fade-in"
                >
                  {/* Thumbnail */}
                  <Link
                    to={ROUTES.PRODUCT_DETAIL(product._id)}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-linear-to-br from-[#fdf8f0] via-[#f7ecdb] to-[#f2e2cc]"
                  >
                    <img
                      src={cloudinaryImg(imageUrl, 320)}
                      alt={product.name}
                      width={320}
                      height={320}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-brand transition-colors duration-300">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="shrink-0 glass rounded-full p-1.5 border border-[#ece1d0] hover:bg-white hover:border-brand/40 transition-all duration-300">
                        <WishlistButton productId={product._id} />
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {product.rating_avg > 0 && product.rating_count > 0 ? (
                        <>
                          <StarRating
                            value={product.rating_avg}
                            size={13}
                            filledClassName="text-amber-400"
                            emptyClassName="text-gray-300"
                          />
                          <span className="text-[11px] text-gray-600 font-medium">
                            {product.rating_avg.toFixed(1)} ({product.rating_count})
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-medium">No reviews yet</span>
                      )}
                      <span
                        className={`text-[11px] font-bold ${
                          outOfStock ? "text-red-600" : product.stock && product.stock < 5 ? "text-orange-600" : "text-green-600"
                        }`}
                      >
                        {outOfStock
                          ? "Out of Stock"
                          : product.stock && product.stock < 5
                            ? `Only ${product.stock} left`
                            : "✓ In Stock"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 flex-wrap mt-1">
                      <span className="text-lg font-bold text-brand">{formatCurrency(product.price)}</span>
                      {getDisplayMrp(product) && (
                        <span className="text-[11px] text-gray-500 line-through font-medium">
                          {formatCurrency(getDisplayMrp(product) as number)}
                        </span>
                      )}
                      {formatDiscount(product.price, getDisplayMrp(product)) > 0 && (
                        <span className="text-[11px] font-bold text-green-600">
                          -{formatDiscount(product.price, getDisplayMrp(product))}%
                        </span>
                      )}
                    </div>

                    {itemError && (
                      <div className="mt-1 p-1.5 bg-red-50/80 border border-red-200 rounded-lg">
                        <p className="text-[11px] text-red-700 font-medium">{itemError}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="hidden sm:flex flex-col gap-2 w-32 shrink-0">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={outOfStock || isAdding}
                      className="w-full py-2 rounded-lg font-semibold text-xs transition-all duration-300 bg-linear-to-r from-brand to-cyan-600 text-white hover:from-brand-dark hover:to-cyan-700 hover:shadow-md disabled:from-cream-deep disabled:to-cream-deep disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none transform active:scale-95"
                    >
                      {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "✓ Added!" : "Add to Cart"}
                    </button>
                    <Link
                      to={ROUTES.PRODUCT_DETAIL(product._id)}
                      className="w-full py-2 rounded-lg font-medium text-xs transition-all duration-300 text-center text-brand border border-brand/30 bg-white hover:bg-brand/5 hover:border-brand/50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* No items after filter */}
      {filteredAndSortedItems.length === 0 && items.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="space-y-4">
            <p className="text-xl text-gray-600">No items in {selectedCategory} category</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-2.5 rounded-lg font-semibold text-brand bg-white border border-brand/30 hover:bg-brand/5 transition-all duration-300"
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
