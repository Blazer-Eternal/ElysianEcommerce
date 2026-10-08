import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchIcon } from "../../components/icons";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilters from "../../components/product/ProductFilters";
import Pagination from "../../components/ui/Pagination";
import type { Product, ProductQueryParams } from "../../types/product.types";

// Stable reference: a fresh [] on every render would defeat ProductGrid's memo.
const EMPTY_PRODUCTS: Product[] = [];

/**
 * Wrapper that owns the inbound `?search=` and `?category=` parameters (the
 * customer portal's top bar hands its query to the catalogue through the
 * former, empty-state category shortcuts use the latter). The catalog itself
 * is keyed on both, so a search or category arriving from another page always
 * starts it from a clean filter state instead of needing a state-sync effect.
 */
const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search")?.trim() || "";
  const urlCategory = searchParams.get("category")?.trim() || "";

  const clearUrlParams = () =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("search");
        next.delete("category");
        return next;
      },
      { replace: true }
    );

  return (
    <ProductCatalog
      key={`${urlSearch}|${urlCategory}`}
      initialSearch={urlSearch}
      initialCategory={urlCategory}
      onClearParams={clearUrlParams}
    />
  );
};

interface ProductCatalogProps {
  initialSearch: string;
  initialCategory: string;
  onClearParams: () => void;
}

const ProductCatalog = ({ initialSearch, initialCategory, onClearParams }: ProductCatalogProps) => {
  const [filters, setFilters] = useState<ProductQueryParams>({
    page: 1,
    limit: 12,
    status: "active",
    sortBy: "created_at",
    sortOrder: "asc",
    ...(initialSearch ? { search: initialSearch } : {}),
    ...(initialCategory ? { category_id: initialCategory } : {}),
  });

  const handleReset = () => {
    onClearParams();
    setFilters({
      page: 1,
      limit: 12,
      status: "active",
      sortBy: "created_at",
      sortOrder: "asc",
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: ({ signal }) => productService.getAll(filters, { signal }),
    staleTime: 5 * 60 * 1000, // catalog page, avoid re-hitting the API on back/forward nav
  });

  // Scroll to top whenever the page number changes, so the user actually
  // sees the new set of products instead of staying near the pagination controls.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [filters.page]);

  return (
    <div className="relative overflow-hidden min-h-screen animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 gpu-accelerate" style={{ contain: "strict", transform: "translateZ(0)" }}>
      </div>

      <div className="space-y-24 py-8 sm:py-16 relative z-10 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
          <div className="mb-16 space-y-6">
            <div className="animate-fade-in gpu-accelerate" style={{ transform: "translateZ(0)" }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-tight gpu-accelerate">
                Discover Our{' '}
                <span className="text-brand" style={{ backgroundSize: '200% 200%' }}>
                  Curated Collection
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl font-light leading-relaxed gpu-accelerate" style={{ animationDelay: '0.1s', transform: "translateZ(0)" }}>
              Filter by category and price, sort by newest first or lowest price, and add what you
              like straight to your cart, checkout takes cash on delivery or eSewa.
            </p>

            <div className="flex gap-3 gpu-accelerate" style={{ animationDelay: '0.2s', transform: "translateZ(0)" }}>
              <div className="h-1 w-12 bg-linear-to-r from-brand to-cyan-500 rounded-full" />
              <div className="h-1 w-3 bg-linear-to-r from-cyan-500 to-teal-400 rounded-full opacity-70" />
            </div>
          </div>

          {/* Filters Section */}
          <div className="gpu-accelerate" style={{ animationDelay: '0.3s', transform: "translateZ(0)" }}>
            <div className="group relative animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>

              {/* Filter Card */}
              <div className="relative glass rounded-2xl p-6 sm:p-10 border border-[#ece1d0] hover:border-brand/60 transition-all duration-500 hover:shadow-lg group-hover:bg-white gpu-accelerate" style={{ contain: "layout style paint" }}>
                <div className="relative z-10">
                  <ProductFilters filters={filters} onChange={setFilters} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
          {/* Loading State - Animated Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-4 border border-[#ece1d0] animate-pulse gpu-accelerate"
                  style={{ animationDelay: `${i * 0.05}s`, transform: "translateZ(0)" }}
                >
                  <div className="w-full aspect-4/3 bg-cream-deep rounded-xl mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-cream-deep rounded w-3/4" />
                    <div className="h-3 bg-cream-deep rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={data?.data ?? EMPTY_PRODUCTS} isLoading={isLoading} />
          )}
        </div>

        {/* Pagination Section */}
        {data?.pagination && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
            <div className="flex justify-center gpu-accelerate" style={{ animationDelay: '0.5s', transform: "translateZ(0)" }}>
              <div className="group relative gpu-accelerate" style={{ contain: "layout style paint" }}>
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-brand/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl gpu-accelerate" style={{ transform: "translateZ(0)" }} />

                {/* Pagination */}
                <div className="relative bg-white rounded-2xl p-6 border border-[#ece1d0] hover:border-brand/50 transition-all duration-300 gpu-accelerate" style={{ contain: "layout style paint" }}>
                  <Pagination
                    pagination={data.pagination}
                    onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 animation-container gpu-accelerate" style={{ contain: "layout style paint" }}>
            <div className="text-center py-20 gpu-accelerate" style={{ transform: "translateZ(0)" }}>
              <div className="mb-4 text-brand/50"><SearchIcon size={56} /></div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 gpu-accelerate">No Products Found</h3>
              <p className="text-gray-600 text-lg mb-8 font-light max-w-md mx-auto gpu-accelerate">
                Clear a filter or try a different search term to see more of the catalogue.
              </p>
              <button
                onClick={handleReset}
                className="group/btn relative px-8 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-brand via-cyan-500 to-teal-400 hover:from-[#8d1222] hover:via-cyan-600 hover:to-teal-500 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden gpu-accelerate"
                style={{ transform: "translateZ(0)", willChange: "transform, box-shadow" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 gpu-accelerate" style={{ transform: "translateZ(0)" }}>
                  Reset Filters
                  <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300 gpu-accelerate" style={{ transform: "translateZ(0)" }}>→</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;