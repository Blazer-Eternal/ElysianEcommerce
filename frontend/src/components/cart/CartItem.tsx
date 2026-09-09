import { useState } from "react";
import { Link } from "react-router-dom";
import type { CartItem as CartItemType } from "../../types/cart.types";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
  if (!product) return null;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    setIsUpdating(true);
    try {
      await updateItem(product._id, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(product._id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={ROUTES.PRODUCT_DETAIL(product._id)} className="font-medium text-sm hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">{formatCurrency(product.price)}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="w-7 h-7 border rounded disabled:opacity-40"
          >
            −
          </button>
          <span className="text-sm w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= product.stock}
            className="w-7 h-7 border rounded disabled:opacity-40"
          >
            +
          </button>

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="ml-4 text-xs text-red-600 hover:underline disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-sm font-semibold shrink-0">
        {formatCurrency(product.price * item.quantity)}
      </div>
    </div>
  );
};

export default CartItem;
