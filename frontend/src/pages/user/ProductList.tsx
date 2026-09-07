import { useState } from "react";
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

  const totalProducts = data?.pagination?.total_items || 0;

  return (
    <div className="space-y-12 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            All <span className="bg-gradient-to-r from-[#0e7c85] to-cyan-600 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Browse our complete collection ({totalProducts} items available)
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-12">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <ProductFilters filters={filters} onChange={setFilters} />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ProductGrid products={data?.data || []} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      {data?.pagination && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <Pagination
              pagination={data.pagination}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;