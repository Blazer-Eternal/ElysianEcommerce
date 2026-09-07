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
      <div className="py-24">
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <div className="flex items-start justify-between">
            <div>
              {category && (
                <Link to={ROUTES.PRODUCTS} className="text-sm text-gray-500 hover:underline">
                  {category.name}
                </Link>
              )}
              <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            </div>
            <WishlistButton productId={product._id} className="text-2xl" />
          </div>

          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
            <span>★ {product.rating_avg.toFixed(1)}</span>
            <span>({product.rating_count} reviews)</span>
          </div>

          <p className="text-2xl font-bold mt-4">{formatCurrency(product.price)}</p>

          <p className="text-sm mt-1">
            {product.stock > 0 ? (
              <span className="text-green-700">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">{product.description}</p>

          <p className="text-xs text-gray-400 mt-4">SKU: {product.sku}</p>

          {addError && <p className="text-sm text-red-600 mt-3">{addError}</p>}
          {addSuccess && <p className="text-sm text-green-700 mt-3">Added to cart!</p>}

          {!outOfStock && (
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 border rounded"
              >
                −
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-8 h-8 border rounded"
              >
                +
              </button>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={outOfStock || isAdding}
            className="mt-4 w-full sm:w-auto bg-black text-white px-6 py-2.5 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {isAuthenticated && <ReviewForm productId={product._id} />}
        <ReviewList productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetail;