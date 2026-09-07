import { Link } from "react-router-dom";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";
import WishlistButton from "../wishlist/WishlistButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const outOfStock = product.stock === 0;

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL(product._id)}
      className="glass rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all block relative"
    >
      <div className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center">
        <WishlistButton productId={product._id} />
      </div>

      <div className="aspect-square bg-white/40 overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="p-3.5">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>

        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <span className="accent-text">★ {product.rating_avg.toFixed(1)}</span>
          <span>({product.rating_count})</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          {outOfStock && <span className="text-xs text-red-600">Out of stock</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;