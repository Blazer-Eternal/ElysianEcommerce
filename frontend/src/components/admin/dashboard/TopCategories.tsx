import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty, PanelSkeleton } from "./PanelStates";
import { PieIcon } from "./icons";
import { formatCurrency } from "../../../utils/formatCurrency";
import type { AnalyticsTotals, TopCategory } from "../../../types/order.types";

interface TopCategoriesProps {
  categories: TopCategory[];
  units: AnalyticsTotals["units"];
  isLoading: boolean;
}

// Bright, ordered palette matching the reference dashboard's donut.
const PALETTE = ["#0e7c85", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#6366f1", "#ec4899"];

/**
 * Donut of category revenue share for the selected period. Categories beyond
 * the first seven are folded into an "Others" slice to keep the legend short.
 */
const TopCategories = memo(({ categories, units, isLoading }: TopCategoriesProps) => {
  const sorted = categories.filter((category) => category.revenue > 0 || category.units > 0);

  const visible = sorted.slice(0, 7);
  const othersRevenue = sorted.slice(7).reduce((sum, category) => sum + category.revenue, 0);
  const entries = [
    ...visible.map((category) => ({ name: category.name, value: category.revenue })),
    ...(othersRevenue > 0 ? [{ name: "Others", value: othersRevenue }] : []),
  ];

  const totalRevenue = entries.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <DashboardPanel title="Top Categories" icon={<PieIcon size={18} />} className="h-full">
      {isLoading ? (
        <PanelSkeleton height={260} />
      ) : entries.length === 0 ? (
        <PanelEmpty message="No category sales yet" hint="Slices appear as products sell." />
      ) : (
        <>
          <div className="relative h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={entries}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {entries.map((entry, index) => (
                    <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e0f2f7", fontSize: 12 }}
                  formatter={(value: unknown) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-gray-900">{units}</p>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Units Sold</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2.5">
            {entries.map((entry, index) => {
              const percent = totalRevenue > 0 ? (entry.value / totalRevenue) * 100 : 0;
              return (
                <li key={entry.name} className="flex items-center gap-2.5 text-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                  />
                  <span className="flex-1 text-gray-700 truncate">{entry.name}</span>
                  <span className="font-semibold text-gray-900">{percent.toFixed(0)}%</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </DashboardPanel>
  );
});
TopCategories.displayName = "TopCategories";

export default TopCategories;
