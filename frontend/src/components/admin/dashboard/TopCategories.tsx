import { memo, useState } from "react";
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

/** One donut slice: revenue drives the arc, units feed the selection view. */
interface DonutEntry {
  name: string;
  value: number;
  units: number;
}

// Bright, ordered palette matching the reference dashboard's donut.
const PALETTE = ["#0e7c85", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#6366f1", "#ec4899"];

/**
 * Donut of category revenue share for the selected period. Categories beyond
 * the first seven are folded into an "Others" slice to keep the legend short.
 *
 * Clicking an arc selects the category it represents (and vice versa — the
 * legend rows are buttons): the slice stays at full color while the others
 * dim, its legend row highlights, and the donut center shows that category's
 * share. Clicking the selected slice or row again clears the selection.
 */
const TopCategories = memo(({ categories, units, isLoading }: TopCategoriesProps) => {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const sorted = categories.filter((category) => category.revenue > 0 || category.units > 0);

  const visible = sorted.slice(0, 7);
  const rest = sorted.slice(7);
  const restRevenue = rest.reduce((sum, category) => sum + category.revenue, 0);
  const restUnits = rest.reduce((sum, category) => sum + category.units, 0);
  const entries: DonutEntry[] = [
    ...visible.map((category) => ({ name: category.name, value: category.revenue, units: category.units })),
    ...(restRevenue > 0 ? [{ name: "Others", value: restRevenue, units: restUnits }] : []),
  ];

  const totalRevenue = entries.reduce((sum, entry) => sum + entry.value, 0);

  // A category can disappear when the period changes — fall back to no selection.
  const selected = entries.find((entry) => entry.name === selectedName) ?? null;

  const toggle = (name: string) => setSelectedName((previous) => (previous === name ? null : name));

  return (
    <DashboardPanel title="Top Categories" icon={<PieIcon size={18} />} className="h-full">
      {isLoading ? (
        <PanelSkeleton height={260} />
      ) : entries.length === 0 ? (
        <PanelEmpty message="No category sales yet" hint="Slices appear as products sell." />
      ) : (
        <>
          <div className="relative h-[170px] [&_.recharts-pie-sector]:cursor-pointer">
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
                  onClick={(_sector, index) => {
                    const entry = entries[index];
                    if (entry) toggle(entry.name);
                  }}
                >
                  {entries.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PALETTE[index % PALETTE.length]}
                      // Selection emphasis: chosen slice stays solid, others recede.
                      fillOpacity={!selected || selected.name === entry.name ? 1 : 0.3}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e0f2f7", fontSize: 12 }}
                  formatter={(value: unknown) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
              {selected ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRevenue > 0 ? ((selected.value / totalRevenue) * 100).toFixed(0) : 0}%
                  </p>
                  <p
                    className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate max-w-full"
                    title={`${selected.name} · ${selected.units} units · ${formatCurrency(selected.value)}`}
                  >
                    {selected.name}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{units}</p>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Units Sold</p>
                </>
              )}
            </div>
          </div>

          <ul className="mt-4 space-y-1.5">
            {entries.map((entry, index) => {
              const percent = totalRevenue > 0 ? (entry.value / totalRevenue) * 100 : 0;
              const isSelected = selected?.name === entry.name;
              return (
                <li key={entry.name}>
                  <button
                    type="button"
                    onClick={() => toggle(entry.name)}
                    aria-pressed={isSelected}
                    title={isSelected ? `Deselect ${entry.name}` : `Select ${entry.name}`}
                    className={`w-full flex items-center gap-2.5 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors ${
                      isSelected ? "bg-brand/10" : "hover:bg-gray-50"
                    } ${selected && !isSelected ? "opacity-50" : ""}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                    />
                    <span className="flex-1 text-gray-700 truncate text-left">{entry.name}</span>
                    <span className="font-semibold text-gray-900">{percent.toFixed(0)}%</span>
                  </button>
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
