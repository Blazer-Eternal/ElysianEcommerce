import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import { ROUTES } from "../../constants/routes";
import ProductCard from "../product/ProductCard";
import type { Product } from "../../types/product.types";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll({ 
          limit: 8, 
          page: 1, 
          status: "active",
          sortBy: "created_at",
          sortOrder: "asc"
        });
        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                <div className="bg-gray-300 rounded-xl h-56 mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-3"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
                <div className="bg-gray-300 h-5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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

