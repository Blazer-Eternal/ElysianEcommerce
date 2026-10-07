import { memo } from "react";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty } from "./PanelStates";
import { BoxIcon, WarningIcon } from "./icons";
import { cloudinaryImg } from "../../../utils/imageUrl";
import type { Product } from "../../../types/product.types";

interface LowStockAlertsProps {
  /** Products at or below the low-stock threshold, cheapest stock first. */
  products: Product[];
  isLoading: boolean;
}

/** Inventory warning list: running-out products with their remaining units. */
const LowStockAlerts = memo(({ products, isLoading }: LowStockAlertsProps) => (
  <DashboardPanel
    title="Low Stock Alerts"
    icon={
      <span className="text-amber-500">
        <WarningIcon size={18} />
      </span>
    }
    action={
      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
        {products.length} Item{products.length === 1 ? "" : "s"}
      </span>
    }
  >
    {isLoading ? (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    ) : products.length === 0 ? (
      <PanelEmpty message="Every product is comfortably stocked" hint="Alerts appear once stock runs low." />
    ) : (
      <ul className="space-y-3">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex items-center gap-3 p-3 rounded-xl bg-cream/70 border border-sand"
          >
            <span className="shrink-0 w-11 h-11 rounded-lg bg-white border border-sand overflow-hidden flex items-center justify-center text-gray-300">
              {product.images?.[0] ? (
                <img
                  src={cloudinaryImg(product.images[0], 96)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <BoxIcon size={18} />
              )}
            </span>

            <p className="flex-1 min-w-0 text-sm font-semibold text-gray-800 truncate">
              {product.name}
            </p>

            <span className="shrink-0 text-sm font-bold text-red-500">
              {product.stock} left
            </span>
          </li>
        ))}
      </ul>
    )}
  </DashboardPanel>
));
LowStockAlerts.displayName = "LowStockAlerts";

export default LowStockAlerts;
