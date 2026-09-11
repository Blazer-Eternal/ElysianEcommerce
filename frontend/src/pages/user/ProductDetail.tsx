import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import ProductGallery from "../../components/product/ProductGallery";
import ReviewList from "../../components/review/ReviewList";
import ReviewForm from "../../components/review/ReviewForm";
import WishlistButton from "../../components/wishlist/WishlistButton";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id as string),
    enabled: !!id,
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
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

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Link to={ROUTES.PRODUCTS} className="underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const product = data.data;
  const category = typeof product.category_id === "object" ? product.category_id : null;
  const outOfStock = product.stock === 0;
  const ratingPercentage = (product.rating_avg / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 animate-fade-in">
          <Link 
            to={ROUTES.PRODUCTS} 
            className="text-sm font-medium text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            Products
          </Link>
          <span className="text-gray-400">/</span>
          {category && (
            <>
              <Link 
                to={ROUTES.PRODUCTS} 
                className="text-sm font-medium text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
              >
                {category.name}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery Container */}
          <div className="flex items-center justify-center animate-slide-in-left">
            <div className="relative w-full">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-blue-400/10 to-indigo-400/10 rounded-2xl blur-2xl -z-10"></div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Product Details Container */}
          <div className="flex flex-col justify-between animate-slide-in-right">
            {/* Header Section */}
            <div className="space-y-6">
              {/* Title and Wishlist */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent mb-2">
                    {product.name}
                  </h1>
                  {category && (
                    <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 uppercase tracking-wider">
                      {category.name}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <WishlistButton productId={product._id} className="text-3xl transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Rating Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="relative">
                          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {i < Math.round(product.rating_avg) && (
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(ratingPercentage - i * 20).toFixed(0)}%` }}>
                              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{product.rating_avg.toFixed(1)}</span>
                  <span className="text-sm text-gray-600">({product.rating_count} reviews)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    product.stock > 0
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-lg shadow-green-200/50'
                      : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 shadow-lg shadow-red-200/50'
                  }`}>
                    {product.stock > 0 ? (
                      <span>✓ In Stock ({product.stock} available)</span>
                    ) : (
                      <span>✗ Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-base">
                {product.description}
              </p>

              {/* SKU */}
              <p className="text-xs text-gray-500 font-mono bg-gray-100/50 rounded-lg px-3 py-2 inline-block">
                SKU: <span className="text-gray-700">{product.sku}</span>
              </p>
            </div>

            {/* Action Section */}
            <div className="mt-8 space-y-4">
              {/* Messages */}
              {addError && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 text-sm font-medium animate-slide-down">
                  {addError}
                </div>
              )}
              {addSuccess && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm font-medium animate-slide-down">
                  ✓ Successfully added to cart!
                </div>
              )}

              {/* Quantity and Add to Cart */}
              {!outOfStock && (
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1.5 shadow-lg border border-gray-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      onMouseEnter={() => setHoveredButton('minus')}
                      onMouseLeave={() => setHoveredButton(null)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 font-bold transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-500 hover:to-indigo-500 hover:text-white hover:shadow-lg hover:shadow-purple-300/50 transform hover:scale-105"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      onMouseEnter={() => setHoveredButton('plus')}
                      onMouseLeave={() => setHoveredButton(null)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 font-bold transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:shadow-lg hover:shadow-indigo-300/50 transform hover:scale-105"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    onMouseEnter={() => setHoveredButton('addCart')}
                    onMouseLeave={() => setHoveredButton(null)}
                    className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: hoveredButton === 'addCart' && !isAdding
                        ? 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #8b5cf6 100%)'
                        : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      boxShadow: hoveredButton === 'addCart' && !isAdding
                        ? '0 20px 40px rgba(236, 72, 153, 0.3)'
                        : '0 10px 25px rgba(124, 58, 237, 0.2)',
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isAdding ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}

              {outOfStock && (
                <button
                  disabled
                  className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-50 transition-all duration-300"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative z-10 mt-16 md:mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Section Header */}
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent mb-8 animate-fade-in">
              Reviews
            </h2>

            {/* Reviews Content */}
            <div className="space-y-8">
              {isAuthenticated && (
                <div className="bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-50/50 rounded-2xl p-6 md:p-8 border border-purple-200/30 backdrop-blur-sm animate-fade-in-up">
                  <ReviewForm productId={product._id} />
                </div>
              )}
              <ReviewList productId={product._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out 0.1s both;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
