import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilters from "../../components/product/ProductFilters";
import Pagination from "../../components/ui/Pagination";
import type { ProductQueryParams } from "../../types/product.types";

const ProductList = () => {
  const [filters, setFilters] = useState<ProductQueryParams>({
    page: 1,
    limit: 12,
    status: "active",
    sortBy: "created_at",
    sortOrder: "asc",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
  });

  // Scroll to top whenever the page number changes, so the user actually
  // sees the new set of products instead of staying near the pagination controls.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [filters.page]);

  return (
    <div className="relative overflow-hidden min-h-screen">
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

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes blob-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          33% { transform: rotate(120deg) scale(1.1); }
          66% { transform: rotate(240deg) scale(0.9); }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob-rotate {
          animation: blob-rotate 4s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-300/15 to-teal-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob-rotate" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-[#0e7c85]/15 to-cyan-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob-rotate" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="space-y-16 py-8 sm:py-16 relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 space-y-6">
            <div className="animate-fade-in-down" style={{ animationDelay: '0s' }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-tight">
                Discover Our{' '}
                <span className="bg-gradient-to-r from-[#0e7c85] via-cyan-500 to-teal-400 bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                  Curated Collection
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Premium quality products handpicked just for you. Explore our exclusive collection featuring the best deals, latest trends, and bestselling items across all categories.
            </p>

            <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="h-1 w-12 bg-gradient-to-r from-[#0e7c85] to-cyan-500 rounded-full" />
              <div className="h-1 w-3 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full opacity-70" />
            </div>
          </div>

          {/* Filters Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="group relative">
              {/* Glow Background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0e7c85]/20 via-cyan-500/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl" />

              {/* Filter Card */}
              <div className="relative glass rounded-3xl p-6 sm:p-10 backdrop-blur-2xl border border-white/70 hover:border-[#0e7c85]/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/30 group-hover:bg-white/60">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{
                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    backgroundSize: '1000px 100%',
                    animation: 'shimmer 3s infinite'
                  }} />
                </div>

                <div className="relative z-10">
                  <ProductFilters filters={filters} onChange={setFilters} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="mb-12 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4">
              <div className="h-1 w-8 bg-gradient-to-r from-[#0e7c85] to-cyan-500 rounded-full" />
              <h2 className="text-sm sm:text-base font-bold text-[#0e7c85] uppercase tracking-widest">
                {data?.pagination?.total || 0} Items Available
              </h2>
            </div>
            <p className="text-gray-600 font-light">Browse through our premium selection</p>
          </div>

          {/* Loading State - Animated Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/40 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="w-full h-64 bg-gradient-to-r from-white/20 to-white/10 rounded-xl mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded w-3/4" />
                    <div className="h-3 bg-gradient-to-r from-white/20 to-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={data?.data || []} isLoading={isLoading} />
          )}
        </div>

        {/* Pagination Section */}
        {data?.pagination && !isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="group relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0e7c85]/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

                {/* Pagination */}
                <div className="relative bg-white/40 backdrop-blur rounded-2xl p-6 border border-white/60 hover:border-[#0e7c85]/50 transition-all duration-300">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center py-20 animate-fade-in-up">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-gray-600 text-lg mb-8 font-light max-w-md mx-auto">
                Try adjusting your filters or search terms to find what you're looking for
              </p>
              <button
                onClick={() => setFilters({
                  page: 1,
                  limit: 12,
                  status: "active",
                  sortBy: "created_at",
                  sortOrder: "asc",
                })}
                className="group/btn relative px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0e7c85] via-cyan-500 to-teal-400 hover:from-[#0e5a68] hover:via-cyan-600 hover:to-teal-500 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Reset Filters
                  <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
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
