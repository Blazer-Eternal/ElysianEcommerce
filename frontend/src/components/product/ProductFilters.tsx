import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import { useDebounce } from "../../hooks/useDebounce";
import type { ProductQueryParams } from "../../types/product.types";

interface ProductFiltersProps {
  filters: ProductQueryParams;
  onChange: (filters: ProductQueryParams) => void;
}

const ProductFilters = ({ filters, onChange }: ProductFiltersProps) => {
  const [search, setSearch] = useState(filters.search || "");
  const debouncedSearch = useDebounce(search, 400);

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const categories = categoriesRes?.data || [];

  return (
    <div className="space-y-4 mb-6">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.category_id || ""}
          onChange={(e) =>
            onChange({ ...filters, category_id: e.target.value || undefined, page: 1 })
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              minPrice: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
          className="border rounded px-3 py-2 text-sm w-28"
        />

        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
          className="border rounded px-3 py-2 text-sm w-28"
        />

        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked || undefined, page: 1 })}
          />
          In stock only
        </label>

        <select
          value={`${filters.sortBy || "created_at"}:${filters.sortOrder || "asc"}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            onChange({ ...filters, sortBy, sortOrder: sortOrder as "asc" | "desc", page: 1 });
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="created_at:asc">Oldest First</option>
          <option value="created_at:desc">Newest First</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;