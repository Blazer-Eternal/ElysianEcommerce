import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import { ROUTES } from "../../constants/routes";
import ProductCard from "../product/ProductCard";

const ProductsSection = () => {
  const { data: response, isLoading: loading } = useQuery({
    queryKey: ["products", { limit: 8, page: 1, status: "active", sortBy: "created_at", sortOrder: "asc" }],
    queryFn: () => productService.getAll({ 
      limit: 8, 
      page: 1, 
      status: "active",
      sortBy: "created_at",
      sortOrder: "asc"
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = response?.data || [];

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-9 sm:mb-11">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Latest Products</h2>
            <p className="text-gray-600 text-sm sm:text-base">Handpicked collection just for you</p>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="hidden sm:inline-block text-sm font-semibold text-[#0e7c85] hover:text-[#0b6169] transition-colors"
          >
            View all products →
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="bg-gray-300 rounded-lg h-40 mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-3"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
                <div className="bg-gray-300 h-5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="mx-auto text-gray-200 mb-4">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 4V2M8 4V2M16 11h.01M8 11h.01"/>
            </svg>
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}

        {/* Mobile "View all products" link */}
        <div className="sm:hidden mt-8 flex justify-center">
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-block text-sm font-semibold text-[#0e7c85] hover:text-[#0b6169] transition-colors"
          >
            View all products →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;

