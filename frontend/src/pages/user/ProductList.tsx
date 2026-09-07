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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <ProductFilters filters={filters} onChange={setFilters} />

      <ProductGrid products={data?.data || []} isLoading={isLoading} />

      {data?.pagination && (
        <Pagination
          pagination={data.pagination}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default ProductList;