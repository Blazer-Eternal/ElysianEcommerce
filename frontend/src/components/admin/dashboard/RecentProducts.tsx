import { memo } from "react";
import { Link } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty } from "./PanelStates";
import { BoxIcon } from "./icons";
import { ROUTES } from "../../../constants/routes";
import { formatCurrency } from "../../../utils/formatCurrency";
import { cloudinaryImg } from "../../../utils/imageUrl";
import type { Product } from "../../../types/product.types";

interface RecentProductsProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

const stockBadge = (stock: number): { label: string; className: string } => {
  if (stock <= 0) return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
  if (stock <= 10) return { label: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
  return { label: "In Stock", className: "bg-green-100 text-green-700" };
};

const categoryName = (product: Product): string =>
  typeof product.category_id === "object" ? product.category_id.name : "—";

/** Latest products table with price, stock and availability badges. */
const RecentProducts = memo(({ products, isLoading }: RecentProductsProps) => (
  <DashboardPanel
    title="Recent Products"
    icon={<BoxIcon size={18} />}
    action={
      <Link
        to={ROUTES.ADMIN_PRODUCTS}
        className="text-xs font-semibold text-[#0e7c85] hover:underline shrink-0"
      >
        View All
      </Link>
    }
    className="h-full"
  >
    {isLoading ? (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    ) : !products || products.length === 0 ? (
      <PanelEmpty message="No products yet" hint="Your newest products will appear here." />
    ) : (
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="pb-3 pr-4 font-semibold">Product</th>
              <th className="pb-3 pr-4 font-semibold hidden sm:table-cell">Category</th>
              <th className="pb-3 pr-4 font-semibold text-right">Price</th>
              <th className="pb-3 pr-4 font-semibold text-right hidden sm:table-cell">Stock</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const badge = stockBadge(product.stock);
              return (
                <tr key={product._id} className="transition-fast hover:bg-white/70">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                        {product.images?.[0] ? (
                          <img
                            src={cloudinaryImg(product.images[0], 80)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <BoxIcon size={18} />
                        )}
                      </span>
                      <span className="font-semibold text-gray-900 truncate max-w-[180px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#0e7c85]/10 text-[#0e7c85] text-xs font-semibold">
                      {categoryName(product)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-700 hidden sm:table-cell">{product.stock}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </DashboardPanel>
));
RecentProducts.displayName = "RecentProducts";

export default RecentProducts;
