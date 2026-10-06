import { memo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty, PanelSkeleton } from "./PanelStates";
import { PieIcon } from "./icons";
import { formatCurrency } from "../../../utils/formatCurrency";
import type { TopCategory } from "../../../types/order.types";

interface TopCategoriesProps {
  categories: TopCategory[];
  isLoading: boolean;
}

/** One donut slice: revenue drives the arc, units feed the selection view. */
interface DonutEntry {
  name: string;
  value: number;
  units: number;
}

// Warm analogue of the phoenix palette, eight tones that stay distinguishable
// inside a donut (deep oxblood -> crimson -> brick -> bronze -> ochre -> amber
// -> rose -> blush) instead of the old cool indigo/violet set.
const PALETTE = ["#c01e2e", "#d18029", "#d48b92", "#5c0a14", "#e5a457", "#8e3b5c", "#96521d", "#efa1ac"];

/** Dark hover tooltip: category name over a color swatch + share percentage. */
const DonutTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: DonutEntry & { share: number; color: string } }>;
}) => {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) return null;
  return (
    <div className="rounded-lg bg-ink px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-bold">{entry.name}</p>
      <p className="mt-1 flex items-center gap-1.5">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: entry.color }}
        />
        {entry.share}
      </p>
    </div>
  );
};

/**
 * Donut of category revenue share for the selected period ("Sales by
 * Category"). Categories beyond the first seven are folded into an "Others"
 * slice to keep the legend short.
 *
 * Clicking an arc selects the category it represents (and vice versa, the
 * legend rows are buttons): the slice stays at full color while the others
 * dim, and the donut center shows that category's share. Clicking the
 * selected slice or row again clears the selection.
 */
const TopCategories = memo(({ categories, isLoading }: TopCategoriesProps) => {
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
  const percentOf = (value: number) => (totalRevenue > 0 ? Math.round((value / totalRevenue) * 100) : 0);

  // A category can disappear when the period changes, fall back to no selection.
  const selected = entries.find((entry) => entry.name === selectedName) ?? null;

  const toggle = (name: string) => setSelectedName((previous) => (previous === name ? null : name));

  // Tooltip payload carries the pre-computed share so the swatch stays in sync
  // with the slice order above.
  const tooltipEntries = entries.map((entry, index) => ({
    ...entry,
    share: percentOf(entry.value),
    color: PALETTE[index % PALETTE.length],
  }));

  return (
    <DashboardPanel
      title="Sales by Category"
      subtitle="Distribution across product lines"
      icon={<PieIcon size={18} />}
      className="h-full"
    >
      {isLoading ? (
        <PanelSkeleton height={300} />
      ) : entries.length === 0 ? (
        <PanelEmpty message="No category sales yet" hint="Slices appear as products sell." />
      ) : (
        <>
          <div className="relative h-[240px] [&_.recharts-pie-sector]:cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tooltipEntries}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="92%"
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={3}
                  startAngle={90}
                  endAngle={-270}
                  onClick={(_sector, index) => {
                    const entry = entries[index];
                    if (entry) toggle(entry.name);
                  }}
                >
                  {tooltipEntries.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      // Selection emphasis: chosen slice stays solid, others recede.
                      fillOpacity={!selected || selected.name === entry.name ? 1 : 0.3}
                    />
                  ))}
                </Pie>
                <Tooltip cursor={false} content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Empty by default (reference design); the center fills in only
                once a slice is picked for inspection. */}
            {selected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
                <p className="text-2xl font-bold text-gray-900">{percentOf(selected.value)}%</p>
                <p
                  className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate max-w-full"
                  title={`${selected.name} · ${selected.units} units · ${formatCurrency(selected.value)}`}
                >
                  {selected.name}
                </p>
              </div>
            )}
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {tooltipEntries.map((entry) => (
              <li key={entry.name}>
                <button
                  type="button"
                  onClick={() => toggle(entry.name)}
                  aria-pressed={selected?.name === entry.name}
                  title={`Select ${entry.name}`}
                  className={`w-full flex items-center gap-2 text-xs rounded-lg px-1.5 py-1 transition-colors ${
                    selected?.name === entry.name ? "bg-brand/10" : "hover:bg-cream-deep/60"
                  } ${selected && selected.name !== entry.name ? "opacity-50" : ""}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 text-gray-600 truncate text-left">
                    {entry.name} ({entry.share}%)
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashboardPanel>
  );
});
TopCategories.displayName = "TopCategories";

export default TopCategories;
