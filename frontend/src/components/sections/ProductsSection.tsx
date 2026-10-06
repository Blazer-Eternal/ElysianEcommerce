import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { ROUTES } from "../../constants/routes";
import ProductCard from "../product/ProductCard";
import { useGridAnimationPause } from "../../hooks/useAnimationPause";
import type { Product } from "../../types/product.types";

// Stable empty array reference — avoids breaking memoization on `products`
// while the query is loading.
const EMPTY_PRODUCTS: Product[] = [];

const ProductsSection = () => {
  const { containerRef } = useGridAnimationPause({ threshold: 0.05, rootMargin: "100px" });
  const { data: response, isLoading: loading } = useQuery({
    queryKey: ["products", { limit: 8, page: 1, status: "active", sortBy: "created_at", sortOrder: "asc" }],
    queryFn: ({ signal }) => productService.getAll({ 
      limit: 8, 
      page: 1, 
      status: "active",
      sortBy: "created_at",
      sortOrder: "asc"
    }, { signal }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = response?.data ?? EMPTY_PRODUCTS;

  return (
    <div className="py-16 sm:py-20 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-9 sm:mb-11">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-dark">
                Fresh in
              </span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-[1.06]">
              Latest arrivals
            </h2>
            <p className="mt-3 text-ink/60 text-sm sm:text-base">
              The eight most recent additions to the catalogue.
            </p>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="group hidden sm:inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            View all products
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse gpu-accelerate" style={{ transform: "translateZ(0)" }}>
                <div className="bg-sand rounded-lg h-40 mb-4"></div>
                <div className="bg-sand h-4 rounded mb-3"></div>
                <div className="bg-sand h-4 rounded w-2/3 mb-4"></div>
                <div className="bg-sand h-5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div 
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 animation-container gpu-accelerate"
            style={{ contain: "layout style paint" }}
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
        ) : (
          <div className="text-center py-16">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="mx-auto text-sand mb-4">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 4V2M8 4V2M16 11h.01M8 11h.01"/>
            </svg>
            <p className="text-ink/55 text-lg">No products available at the moment.</p>
          </div>
        )}

        {/* Mobile "View all products" link */}
        <div className="sm:hidden mt-8 flex justify-center">
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-block text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            View all products →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsSection;

