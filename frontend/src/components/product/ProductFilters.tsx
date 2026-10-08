import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/categoryService";
import { useDebounce } from "../../hooks/useDebounce";
import CategoryDropdown from "./CategoryDropdown";
import PriceDropdown from "./PriceDropdown";
import {
  PRICE_RANGES,
  parsePriceRanges,
  priceRangeKey,
  type PriceRange,
} from "../../constants/priceRanges";
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
    queryFn: ({ signal }) => categoryService.getAll({ signal }),
    staleTime: 5 * 60 * 1000, // singleton data, categories rarely change
  });

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const categories = categoriesRes?.data || [];

  // Selection lives inside `filters` (not local state) so the page's
  // "Reset Filters" button clears it along with everything else.
  const selectedRanges = parsePriceRanges(filters.priceRanges);

  const togglePriceRange = (range: PriceRange) => {
    const next = new Set(selectedRanges);
    const key = priceRangeKey(range);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    // Serialize in canonical PRICE_RANGES order so toggling is deterministic.
    const encoded = PRICE_RANGES.filter((candidate) => next.has(priceRangeKey(candidate)))
      .map(priceRangeKey)
      .join(",");
    onChange({ ...filters, priceRanges: encoded || undefined, page: 1 });
  };

  const clearPriceRanges = () =>
    onChange({ ...filters, priceRanges: undefined, page: 1 });

  return (
    <div className="space-y-4 mb-6">
      <input
        id="product-search"
        name="search"
        type="text"
        aria-label="Search products"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-[#ece1d0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-colors"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <CategoryDropdown
          categories={categories}
          selectedId={filters.category_id}
          onSelect={(categoryId) => onChange({ ...filters, category_id: categoryId, page: 1 })}
        />

        <PriceDropdown
          selected={selectedRanges}
          onToggle={togglePriceRange}
          onClear={clearPriceRanges}
        />

        <label
          htmlFor="in-stock-only"
          className="flex items-center gap-2 border border-[#ece1d0] rounded-lg px-3 py-2 text-sm bg-white text-gray-700 hover:border-brand/40 hover:text-brand transition-colors cursor-pointer"
        >
          <input
            id="in-stock-only"
            name="inStock"
            type="checkbox"
            className="accent-brand"
            checked={filters.inStock === true}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked || undefined, page: 1 })}
          />
          In stock only
        </label>

        <select
          id="sort-products"
          name="sort"
          aria-label="Sort products"
          value={`${filters.sortBy || "created_at"}:${filters.sortOrder || "asc"}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            onChange({ ...filters, sortBy, sortOrder: sortOrder as "asc" | "desc", page: 1 });
          }}
          className="border border-[#ece1d0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-colors hover:border-brand/40"
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
