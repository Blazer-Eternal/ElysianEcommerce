import type { Product } from "../../types/product.types";
import ProductCard from "./ProductCard";
import Spinner from "../ui/Spinner";
import { useGridAnimationPause } from "../../hooks/useAnimationPause";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  const { containerRef } = useGridAnimationPause({ threshold: 0.05, rootMargin: "100px" });
  
  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300 mb-4">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6M9 9l6 6" />
        </svg>
        <p className="text-gray-500 text-lg">No products found.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 animation-container gpu-accelerate"
      style={{ contain: "layout style paint", willChange: "contents" }}
    >
      {products.map((product, index) => (
        <div 
          key={product._id}
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
            transform: "translateZ(0)"
          }}
          className="gpu-accelerate"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;