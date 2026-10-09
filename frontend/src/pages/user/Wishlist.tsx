import { useState, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BoxIcon,
  CoinsIcon,
  HeartFilledIcon,
  HeartIcon,
  SparklesIcon,
  TicketIcon,
} from "../../components/icons";
import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";
import { useCartActions } from "../../hooks/useCart";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category.types";
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

const savedDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const productOf = (item: { product_id: Product | string }): Product | null =>
  typeof item.product_id === "object" ? (item.product_id as Product) : null;

const categoryName = (product: Product, nameById: Map<string, string>): string | null => {
  const categoryId = product.category_id;
  if (!categoryId) return null;
  if (typeof categoryId === "object") return categoryId.name;
  // The wishlist payload ships the raw id, so resolve it against the category
  // list rather than ever printing an ObjectId as a label.
  return nameById.get(categoryId) ?? null;
};

const asStat = (label: string, value: string, icon: ReactNode, tone: string) => ({
  label,
  value,
  icon,
  tone,
});

const Wishlist = () => {
  const { items, isLoading } = useWishlist();
  const { addItem } = useCartActions();
  const isAdmin = useIsAdmin();

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; message: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Real storefront categories, used for the empty-state shortcuts.
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => categoryService.getAll({ signal }),
    staleTime: 5 * 60 * 1000,
  });

  // id -> name, so wishlist items (which carry only the raw category id) can
  // be grouped under readable names.
  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    (categoriesRes?.data ?? []).forEach((category) => map.set(category._id, category.name));
    return map;
  }, [categoriesRes]);

  // Category tree grouped for the empty state: products only ever sit on a leaf
  // category, so each group pairs a top-level category with the leaves under it
  // and links straight to a filter that returns results.
  const categoryGroups = useMemo(() => {
    const all = categoriesRes?.data ?? [];
    if (all.length === 0) return [];

    const parentOf = new Map<string, string>();
    const childCount = new Map<string, number>();
    all.forEach((category) => {
      const parentId =
        typeof category.parent_id === "object" ? category.parent_id?._id : category.parent_id;
      if (parentId) {
        parentOf.set(category._id, parentId);
        childCount.set(parentId, (childCount.get(parentId) ?? 0) + 1);
      }
    });

    const rootIdOf = (category: Category): string => {
      let current = category;
      for (let hop = 0; hop < 10; hop += 1) {
        const parentId = parentOf.get(current._id);
        if (!parentId) break;
        const parent = all.find((candidate) => candidate._id === parentId);
        if (!parent) break;
        current = parent;
      }
      return current._id;
    };

    return all
      .filter((category) => !parentOf.has(category._id))
      .map((root) => ({
        root,
        leaves: all.filter(
          (candidate) =>
            (childCount.get(candidate._id) ?? 0) === 0 && rootIdOf(candidate) === root._id
        ),
      }))
      .filter((group) => group.leaves.length > 0)
      .slice(0, 4)
      .map((group) => ({ root: group.root, leaves: group.leaves.slice(0, 3) }));
  }, [categoriesRes]);

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

  // Categories the saved items actually belong to, with their item counts.
  const { categories, categoryCounts } = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => {
      const product = productOf(item);
      const name = product ? categoryName(product, categoryNameById) : null;
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    return { categories: Array.from(counts.keys()), categoryCounts: counts };
  }, [items, categoryNameById]);

  // Totals computed from the saved products themselves.
  const stats = useMemo(() => {
    let total = 0;
    let savings = 0;
    let inStock = 0;
    items.forEach((item) => {
      const product = productOf(item);
      if (!product) return;
      total += product.price;
      const mrp = getDisplayMrp(product);
      if (mrp) savings += mrp - product.price;
      if (product.stock > 0) inStock += 1;
    });
    return { total, savings, inStock };
  }, [items]);

  const newestSaved = useMemo(() => {
    let latest = "";
    items.forEach((item) => {
      if (!latest || new Date(item.created_at).getTime() > new Date(latest).getTime()) {
        latest = item.created_at;
      }
    });
    return savedDate(latest);
  }, [items]);

  const statCards = [
    asStat("Saved items", String(items.length), <HeartFilledIcon size={18} />, "bg-teal-50 text-brand"),
    asStat("Total value", formatCurrency(stats.total), <CoinsIcon size={18} />, "bg-cyan-100 text-cyan-700"),
    asStat("You save", formatCurrency(stats.savings), <TicketIcon size={18} />, "bg-green-50 text-green-700"),
    asStat("In stock", `${stats.inStock} of ${items.length}`, <BoxIcon size={18} />, "bg-cyan-100 text-ink"),
  ];

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (selectedCategory === "all") return true;
      const product = productOf(item);
      if (!product) return false;
      return categoryName(product, categoryNameById) === selectedCategory;
    });

    return filtered.sort((a, b) => {
      const productA = productOf(a);
      const productB = productOf(b);

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
  }, [items, selectedCategory, sortBy, categoryNameById]);

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-full relative overflow-hidden bg-linear-to-br from-cream via-white to-cyan-100 flex items-center justify-center px-4 py-14">
        <style>{`
          @keyframes wishlist-beat {
            0%, 100% { transform: scale(1); }
            12% { transform: scale(1.12); }
            24% { transform: scale(1); }
            36% { transform: scale(1.08); }
            48% { transform: scale(1); }
          }
          @keyframes wishlist-halo {
            0% { transform: scale(0.92); opacity: 0.9; }
            70% { transform: scale(1.18); opacity: 0; }
            100% { transform: scale(1.18); opacity: 0; }
          }
          @keyframes wishlist-float {
            0%, 100% { transform: translateY(0) rotate(-8deg); opacity: 0.5; }
            50% { transform: translateY(-16px) rotate(8deg); opacity: 0.95; }
          }
          .wishlist-beat { animation: wishlist-beat 2.6s ease-in-out infinite; }
          .wishlist-halo { animation: wishlist-halo 2.8s ease-out infinite; }
          .wishlist-float { animation: wishlist-float 5.5s ease-in-out infinite; }
        `}</style>

        {/* Floating hearts around the card */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-brand/10">
          <span className="absolute left-[7%] top-[14%] wishlist-float"><HeartFilledIcon size={44} /></span>
          <span className="absolute right-[10%] top-[22%] wishlist-float" style={{ animationDelay: "1.2s" }}>
            <HeartIcon size={32} />
          </span>
          <span className="absolute left-[14%] bottom-[18%] wishlist-float" style={{ animationDelay: "2.4s" }}>
            <SparklesIcon size={30} />
          </span>
          <span className="absolute right-[16%] bottom-[14%] wishlist-float" style={{ animationDelay: "3.6s" }}>
            <HeartFilledIcon size={24} />
          </span>
        </div>

        <div className="relative w-full max-w-2xl rounded-3xl border border-[#ece1d0] bg-white/85 backdrop-blur-sm px-6 py-10 sm:px-10 sm:py-12 text-center shadow-sm animate-scale-in">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(192,30,46,0.10) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
            }}
          />

          <div className="relative">
            {/* Heart emblem */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <span aria-hidden="true" className="absolute inset-0 rounded-full bg-teal-50" />
                <span aria-hidden="true" className="absolute inset-0 rounded-full border border-brand/30 wishlist-halo" />
                <span
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full border border-brand/15 wishlist-halo"
                  style={{ animationDelay: "0.9s" }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-brand wishlist-beat">
                  <HeartFilledIcon size={40} />
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-3 max-w-md mx-auto">
              Tap the heart on any product to save it. Saved items stay here with their price, stock
              and any discount until you move them to your cart.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-7">
              <Link
                to={ROUTES.PRODUCTS}
                className="px-8 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-brand to-cyan-600 hover:from-brand-dark hover:to-cyan-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform active:scale-95"
              >
                Browse Products →
              </Link>
              <Link
                to={ROUTES.HOME}
                className="px-8 py-3.5 rounded-xl font-semibold text-brand bg-white border border-brand/30 hover:bg-teal-50 hover:border-brand/50 transition-all duration-300 hover:shadow-lg"
              >
                Go Home
              </Link>
            </div>

            {/* Real categories from the storefront */}
            {categoryGroups.length > 0 && (
              <div className="mt-9 pt-6 border-t border-[#ece1d0] text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4 text-center">
                  Browse by category
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {categoryGroups.map((group) => (
                    <div key={group.root._id}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand mb-2">
                        {group.root.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.leaves.map((leaf) => (
                          <Link
                            key={leaf._id}
                            to={`${ROUTES.PRODUCTS}?category=${leaf._id}`}
                            className="px-3 py-1.5 rounded-full border border-[#ece1d0] bg-white text-[13px] font-medium text-gray-700 hover:border-brand hover:text-brand hover:bg-teal-50 transition-all duration-300"
                          >
                            {leaf.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-linear-to-br from-cream via-white to-cyan-100 py-8 sm:py-14">
      <style>{`
        @keyframes wishlist-halo {
          0% { transform: scale(0.94); opacity: 0.9; }
          70% { transform: scale(1.14); opacity: 0; }
          100% { transform: scale(1.14); opacity: 0; }
        }
        .wishlist-halo { animation: wishlist-halo 3s ease-out infinite; }
      `}</style>

      {/* Header banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl border border-[#ece1d0] bg-white shadow-sm">
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-teal-50 via-white to-cyan-50" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(192,30,46,0.10) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 -bottom-16 pointer-events-none"
            style={{ color: "rgba(192,30,46,0.07)" }}
          >
            <HeartFilledIcon size={240} />
          </div>

          <div className="relative p-5 sm:p-7 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <span aria-hidden="true" className="absolute -inset-2 rounded-3xl border border-brand/20 wishlist-halo" />
                <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-brand to-brand-dark text-white flex items-center justify-center shadow-lg shadow-brand/25">
                  <HeartFilledIcon size={26} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {items.length} item{items.length !== 1 ? "s" : ""} saved
                  {newestSaved && <> · last added {newestSaved}</>}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-[#ece1d0] bg-white/80 backdrop-blur-sm px-3.5 py-2.5"
                >
                  <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${stat.tone}`}>
                    {stat.icon}
                  </span>
                  <div className="leading-tight min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {stat.label}
                    </div>
                    <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between rounded-2xl border border-[#ece1d0] bg-white px-4 py-3 shadow-sm">
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-linear-to-r from-brand to-cyan-600 text-white shadow-md -translate-y-0.5"
                  : "border border-[#ece1d0] text-gray-700 bg-white hover:border-brand/40 hover:text-brand"
              }`}
            >
              All Items
              <span
                className={`ml-1.5 text-[11px] font-bold ${
                  selectedCategory === "all" ? "text-white/80" : "text-gray-400"
                }`}
              >
                {items.length}
              </span>
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-brand to-cyan-600 text-white shadow-md -translate-y-0.5"
                    : "border border-[#ece1d0] text-gray-700 bg-white hover:border-brand/40 hover:text-brand"
                }`}
              >
                {category}
                <span
                  className={`ml-1.5 text-[11px] font-bold ${
                    selectedCategory === category ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {categoryCounts.get(category) ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

            <div className="flex items-center gap-2">
              <label
                htmlFor="wishlist-sort"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Sort
              </label>
              <select
                id="wishlist-sort"
                name="sort"
                aria-label="Sort wishlist"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-lg border border-[#ece1d0] bg-white text-sm text-gray-900 font-medium hover:border-brand/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="newest">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products, Grid / List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-max">
            {filteredAndSortedItems.map((item) => {
              const product = productOf(item);
              if (!product) return null;

              const outOfStock = product.stock === 0;
              const isAdding = addingId === product._id;
              const justAdded = addedId === product._id;
              const itemError = errorId?.id === product._id ? errorId.message : null;
              const imageUrl = product.images?.[0] || "/placeholder.svg";
              const discount = formatDiscount(product.price, getDisplayMrp(product));

              return (
                <div key={item._id} className="group h-full animate-fade-in">
                  <div className="h-full rounded-2xl overflow-hidden bg-white transition-all duration-300 flex flex-col shadow-md hover:shadow-xl border border-[#ece1d0] hover:border-brand/40 hover:-translate-y-1 transform-gpu will-animate">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-linear-to-br from-cyan-50 via-[#f7ecdb] to-[#f2e2cc] aspect-4/3 group">
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
                      <div className="absolute top-2 left-2">
                        <div className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold border border-[#ece1d0]">
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
                      </div>

                      {/* Wishlist Button, always visible */}
                      <div className="absolute top-2 right-2 z-20">
                        <div className="glass rounded-full p-1.5 hover:bg-white transition-all duration-300 border border-[#ece1d0] hover:border-brand/40 hover:scale-110">
                          <WishlistButton productId={product._id} />
                        </div>
                      </div>

                      {/* Discount ribbon */}
                      {discount > 0 && (
                        <div className="absolute bottom-2 left-2 rounded-full bg-linear-to-r from-brand to-brand-dark text-white text-[11px] font-bold px-2.5 py-1 shadow-md">
                          -{discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-3.5 flex flex-col gap-1.5 flex-1">
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
                      </div>

                      {/* Error Message */}
                      {itemError && (
                        <div className="p-1.5 bg-red-50/80 border border-red-200 rounded-lg">
                          <p className="text-[11px] text-red-700 font-medium">{itemError}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto pt-1.5 flex gap-2">
                        {!isAdmin && (
                          <button
                            onClick={() => handleAddToCart(product._id)}
                            disabled={outOfStock || isAdding}
                            className="flex-1 py-2 rounded-lg font-semibold text-xs transition-all duration-300 bg-linear-to-r from-brand to-cyan-600 text-white hover:from-brand-dark hover:to-cyan-700 hover:shadow-md disabled:from-cream-deep disabled:to-cream-deep disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none transform active:scale-95"
                          >
                            {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "✓ Added!" : "Add to Cart"}
                          </button>
                        )}
                        <Link
                          to={ROUTES.PRODUCT_DETAIL(product._id)}
                          className="px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 text-brand border border-brand/30 bg-white hover:bg-teal-50 hover:border-brand/50"
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
              const product = productOf(item);
              if (!product) return null;

              const outOfStock = product.stock === 0;
              const isAdding = addingId === product._id;
              const justAdded = addedId === product._id;
              const itemError = errorId?.id === product._id ? errorId.message : null;
              const imageUrl = product.images?.[0] || "/placeholder.svg";
              const savedOn = savedDate(item.created_at);

              return (
                <div
                  key={item._id}
                  className="group flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-xl border border-[#ece1d0] shadow-sm hover:shadow-md hover:border-brand/40 transition-all duration-300 animate-fade-in"
                >
                  {/* Thumbnail */}
                  <Link
                    to={ROUTES.PRODUCT_DETAIL(product._id)}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-linear-to-br from-cyan-50 via-[#f7ecdb] to-[#f2e2cc]"
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
                      {savedOn && (
                        <span className="text-[11px] text-gray-400 font-medium">Saved {savedOn}</span>
                      )}
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
                    {!isAdmin && (
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={outOfStock || isAdding}
                        className="w-full py-2 rounded-lg font-semibold text-xs transition-all duration-300 bg-linear-to-r from-brand to-cyan-600 text-white hover:from-brand-dark hover:to-cyan-700 hover:shadow-md disabled:from-cream-deep disabled:to-cream-deep disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none transform active:scale-95"
                      >
                        {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "✓ Added!" : "Add to Cart"}
                      </button>
                    )}
                    <Link
                      to={ROUTES.PRODUCT_DETAIL(product._id)}
                      className="w-full py-2 rounded-lg font-medium text-xs transition-all duration-300 text-center text-brand border border-brand/30 bg-white hover:bg-teal-50 hover:border-brand/50"
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
            <p className="text-xl text-gray-600">
              No saved items in {selectedCategory} yet
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-2.5 rounded-lg font-semibold text-brand bg-white border border-brand/30 hover:bg-teal-50 transition-all duration-300"
            >
              View all {items.length} saved items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
