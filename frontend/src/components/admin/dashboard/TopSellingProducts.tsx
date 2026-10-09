import { memo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty, PanelSkeleton } from "./PanelStates";
import { BarsIcon } from "./icons";
import { formatCurrency } from "../../../utils/formatCurrency";
import type { TopProduct } from "../../../types/order.types";

interface TopSellingProductsProps {
  products: TopProduct[];
  isLoading: boolean;
}

const shortLabel = (name: string, max = 12): string =>
  name.length > max ? `${name.slice(0, max - 1)}…` : name;

/** Units sold per best-selling product for the selected period. */
const TopSellingProducts = memo(({ products, isLoading }: TopSellingProductsProps) => {
  const data = products
    .filter((product) => product.units > 0)
    .map((product) => ({
      label: shortLabel(product.name ?? "Deleted product"),
      name: product.name ?? "Deleted product",
      units: product.units,
      revenue: product.revenue,
    }));

  return (
    <DashboardPanel title="Top Selling Products" icon={<BarsIcon size={18} />} className="h-full">
      {isLoading ? (
        <PanelSkeleton height={240} />
      ) : data.length === 0 ? (
        <PanelEmpty message="No product sales yet" hint="Best sellers appear after the first orders." />
      ) : (
        <div className="h-60 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1e6d4" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9a8b7e" }}
                tickLine={false}
                axisLine={false}
                interval={0}
                height={44}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9a8b7e" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={38}
              />
              <Tooltip
                cursor={{ fill: "rgba(192,30,46,0.06)" }}
                contentStyle={{ borderRadius: 12, border: "1px solid #f1e6d4", fontSize: 12 }}
                formatter={(value: unknown) => `${Number(value)} units`}
                labelFormatter={(_label: unknown, payload) => {
                  const row = payload?.[0]?.payload as { name?: string; revenue?: number } | undefined;
                  if (!row?.name) return "";
                  return `${row.name} · ${formatCurrency(row.revenue ?? 0)}`;
                }}
              />
              <Bar dataKey="units" name="Units Sold" fill="#c01e2e" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardPanel>
  );
});
TopSellingProducts.displayName = "TopSellingProducts";

export default TopSellingProducts;
