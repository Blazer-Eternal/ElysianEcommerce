import type { Product } from "../../types/product.types";
import ProductCard from "./ProductCard";
import Spinner from "../ui/Spinner";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-16">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;