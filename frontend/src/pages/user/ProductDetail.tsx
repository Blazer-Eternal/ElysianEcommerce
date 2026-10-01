import { useState } from "react";
import { MessageIcon } from "../../components/icons";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import ProductGallery from "../../components/product/ProductGallery";
import ReviewSection from "../../components/review/ReviewSection";
import StarRating from "../../components/ui/StarRating";
import WishlistButton from "../../components/wishlist/WishlistButton";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useCartActions } from "../../hooks/useCart";
import { formatCurrency, formatDiscount, getDisplayMrp } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";

/** Turns a multi-line description into bullets; single-line text stays a paragraph. */
const toLines = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
  </svg>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCartActions();
  const navigate = useNavigate();
  const location = useLocation();

  // Sent along at login so the customer lands back on this product afterwards.
  const loginRedirectState = { state: { from: `${location.pathname}${location.search}` } };

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [shareState, setShareState] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: ({ signal }) => productService.getById(id as string, { signal }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // catalog detail — review mutations still invalidate ["product", id]
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, loginRedirectState);
      return;
    }
    if (!id) return;

    setAddError(null);
    setIsAdding(true);
    try {
      await addItem(id, quantity);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch (err) {
      setAddError(getErrorMessage(err));
    } finally {
      setIsAdding(false);
    }
  };

  /**
   * Buy Now never touches the cart: it hands the chosen product and quantity to
   * the checkout page (?buyNow=<id>&qty=<n>), which orders them directly.
   */
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, loginRedirectState);
      return;
    }
    if (!id) return;
    navigate(`${ROUTES.CHECKOUT}?buyNow=${id}&qty=${quantity}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareState("Link copied!");
      setTimeout(() => setShareState(null), 2000);
    } catch {
      setShareState("Could not share");
      setTimeout(() => setShareState(null), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Link to={ROUTES.PRODUCTS} className="underline text-brand">
          Back to Products
        </Link>
      </div>
    );
  }

  const product = data.data;
  const category = typeof product.category_id === "object" ? product.category_id : null;
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= 5;

  const mrp = getDisplayMrp(product);
  const discount = formatDiscount(product.price, mrp);

  const brand = product.brand?.trim() || null;
  const descriptionLines = toLines(product.description || "");
  const benefits = product.key_benefits?.length ? product.key_benefits : [];
  const howToUse = product.how_to_use?.length ? product.how_to_use : [];

  const sectionTitle = "text-lg font-extrabold tracking-wide text-gray-900 uppercase";
  const card = "bg-white rounded-lg border border-gray-200 shadow-sm";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to={ROUTES.HOME} className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link to={ROUTES.PRODUCTS} className="hover:text-brand">Products</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={ROUTES.PRODUCTS} className="hover:text-brand">{category.name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1 max-w-[50vw]">{product.name}</span>
        </nav>

        {/* Top: gallery + buy box */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] gap-4">
          {/* Gallery */}
          <div className={`${card} p-4 h-fit lg:sticky lg:top-20`}>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Buy box */}
          <div className={`${card} p-4 sm:p-6 relative`}>
            {/* Share + wishlist */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 text-gray-500">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this product"
                className="p-1.5 rounded-full hover:bg-gray-100 hover:text-brand transition-colors"
              >
                <ShareIcon />
              </button>
              <WishlistButton productId={product._id} />
              {shareState && (
                <span className="absolute right-0 top-full mt-1 text-xs bg-gray-900 text-white rounded px-2 py-1 whitespace-nowrap">
                  {shareState}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="pr-16 text-xl sm:text-2xl font-semibold leading-snug text-gray-900">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="mt-3 flex items-center gap-2">
              <StarRating value={product.rating_avg} size={16} />
              <a href="#reviews" className="text-sm text-brand font-medium hover:underline">
                Ratings {product.rating_count}
              </a>
              {category && (
                <span className="text-sm text-gray-400">| {category.name}</span>
              )}
            </div>

            {/* Brand line */}
            {brand && (
              <div className="mt-3 text-sm text-gray-600">
                Brand:{" "}
                <span className="text-brand font-medium">{brand}</span>
                <span className="text-gray-400 mx-2">|</span>
                <Link to={ROUTES.PRODUCTS} className="text-brand hover:underline">
                  More {category?.name ?? "products"} from {brand}
                </Link>
              </div>
            )}

            <hr className="my-4 border-gray-200" />

            {/* Price */}
            <div>
              <p className="text-4xl font-semibold text-[#f26522]">{formatCurrency(product.price)}</p>
              <div className="mt-1 flex items-center gap-3 text-sm">
                {mrp && (
                  <span className="text-gray-500 line-through">{formatCurrency(mrp)}</span>
                )}
                {discount > 0 && (
                  <span className="text-gray-700 font-medium">-{discount}%</span>
                )}
                <span className="text-gray-400">Inclusive of all taxes</span>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Availability */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600 w-24 shrink-0">Availability</span>
              {outOfStock ? (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              ) : lowStock ? (
                <span className="text-[#f26522] font-semibold">
                  Almost sold out, buy now! ({product.stock} left)
                </span>
              ) : (
                <span className="text-green-600 font-semibold">In Stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="text-gray-600">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={outOfStock}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-md border border-gray-300 bg-gray-50 text-xl text-gray-600 flex items-center justify-center hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                  disabled={outOfStock}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-md border border-gray-300 bg-gray-50 text-xl text-gray-600 flex items-center justify-center hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
              {lowStock && (
                <span className="text-sm text-gray-500">Hurry! Only {product.stock} left in stock</span>
              )}
            </div>

            {/* Messages */}
            {addError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {addError}
              </div>
            )}
            {addSuccess && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                ✓ Successfully added to cart!
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="py-3.5 rounded-lg bg-[#28a3e8] hover:bg-[#1b8fd6] text-white font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || outOfStock}
                className="py-3.5 rounded-lg bg-[#f26522] hover:bg-[#e05613] text-white font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {outOfStock && (
              <p className="mt-3 text-sm text-center text-gray-500">
                This product is currently out of stock.
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <section className={`${card} mt-4 overflow-hidden`}>
          <h2 className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 text-base font-bold text-gray-900">
            Description
          </h2>
          <div className="p-4 sm:p-6 space-y-6">
            <div className="rounded-md border border-gray-200 bg-gray-50/60 p-3 text-xs leading-relaxed text-gray-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#28a3e8] mr-2 align-middle" />
              The image provided here is only for reference purpose. Actual product packaging and
              materials may contain more and different information than what is shown on our app or
              website. We recommend that you do not rely solely on the information presented here and
              that you always read labels, warnings, and directions before using or consuming a
              product.
            </div>

            {/* FAQ copy: lines ending in "?" are the question bullets, the line
                beneath each one is its answer (indented, no bullet). */}
            {descriptionLines.length > 1 ? (
              <div className="text-sm text-gray-800 leading-relaxed">
                {descriptionLines.map((line, index) =>
                  line.endsWith("?") ? (
                    <p key={index} className="mt-4 flex gap-2 first:mt-0">
                      <span aria-hidden="true" className="text-gray-400 select-none">•</span>
                      <span className="font-medium text-gray-900">{line}</span>
                    </p>
                  ) : (
                    <p key={index} className="pl-4 text-gray-700">
                      {line}
                    </p>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-800 leading-relaxed">
                {descriptionLines[0] || product.description}
              </p>
            )}

            {benefits.length > 0 && (
              <div>
                <h3 className={sectionTitle}>Product Benefits</h3>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-gray-800 leading-relaxed">
                  {benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* How to use */}
        {howToUse.length > 0 && (
          <section className={`${card} mt-4 overflow-hidden`}>
            <h2 className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 text-base font-bold text-gray-900 uppercase tracking-wide">
              How to Use
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 p-4 sm:p-6 space-y-2 text-sm text-gray-800 leading-relaxed">
              {howToUse.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Specifications */}
        <section className={`${card} mt-4 overflow-hidden`}>
          <h2 className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 text-base font-bold text-gray-900">
            Specifications
          </h2>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-sm">
            <div>
              <p className="text-gray-500">Brand</p>
              <p className="font-semibold text-gray-900">{brand ?? "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">SKU</p>
              <p className="font-semibold text-gray-900 break-all">{product.sku}</p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-semibold text-gray-900">{category?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">Availability</p>
              <p className="font-semibold text-gray-900">
                {outOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="font-semibold text-gray-900">
                {product.rating_avg.toFixed(1)} / 5 ({product.rating_count} ratings)
              </p>
            </div>
            <div>
              <p className="text-gray-500">MRP</p>
              <p className="font-semibold text-gray-900">{formatCurrency(mrp ?? product.price)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500">What&apos;s in the box</p>
              <p className="font-semibold text-gray-900">{product.name}</p>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className={`${card} mt-4 overflow-hidden scroll-mt-24`}>
          <h2 className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 text-base font-bold text-gray-900">
            Ratings &amp; Reviews
          </h2>
          <div className="p-4 sm:p-6">
            {isAuthenticated ? (
              <ReviewSection productId={product._id} />
            ) : (
              <div className="text-center py-6">
                <div className="mb-3 text-gray-400"><MessageIcon size={36} /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Login to see &amp; post reviews
                </h3>
                <p className="text-gray-600 max-w-xl mx-auto mb-6">
                  Customer reviews for this product are visible to members only. Please log in
                  (or create a free account) to read what others think and to share your own
                  experience.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to={ROUTES.LOGIN}
                    className="w-full sm:w-auto py-3 px-8 rounded-lg font-semibold text-white bg-brand hover:bg-[#0b6870] transition-colors"
                  >
                    Login to View Reviews
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="w-full sm:w-auto py-3 px-8 rounded-lg font-semibold text-brand bg-white border border-brand/40 hover:bg-brand/5 transition-colors"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
