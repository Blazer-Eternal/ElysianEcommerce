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

const Wishlist = () => {
  const { items, isLoading } = useWishlist();
  const { addItem } = useCart();

  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; message: string } | null>(null);

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
      <div className="py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
        <Link to={ROUTES.PRODUCTS} className="underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
          if (!product) return null;

          const outOfStock = product.stock === 0;
          const isAdding = addingId === product._id;
          const justAdded = addedId === product._id;
          const itemError = errorId?.id === product._id ? errorId.message : null;

          return (
            <div key={item._id} className="glass rounded-2xl overflow-hidden relative">
              <div className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center">
                <WishlistButton productId={product._id} />
              </div>

              <Link to={ROUTES.PRODUCT_DETAIL(product._id)}>
                <div className="aspect-square bg-white/40 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3.5">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <span className="font-semibold">{formatCurrency(product.price)}</span>
                </div>
              </Link>

              <div className="px-3.5 pb-3.5">
                {itemError && <p className="text-xs text-red-600 mb-1.5">{itemError}</p>}

                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={outOfStock || isAdding}
                  className="w-full text-xs py-2 rounded-full bg-[#0e7c85] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-[#0b6169] transition-colors"
                >
                  {outOfStock ? "Out of Stock" : isAdding ? "Adding..." : justAdded ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;