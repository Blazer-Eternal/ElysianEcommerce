import { memo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty, PanelSkeleton } from "./PanelStates";
import { ChartIcon } from "./icons";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDayLabel } from "../../../utils/formatDate";
import type { AnalyticsPoint } from "../../../types/order.types";

interface SalesOverviewProps {
  current: AnalyticsPoint[];
  previous: AnalyticsPoint[];
  isLoading: boolean;
}

const formatCompact = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return `${value}`;
};

interface LegendToggleProps {
  label: string;
  color: string;
  total: number;
  active: boolean;
  onToggle: () => void;
  /** Kept for assistive tech when the series is hidden. */
  hiddenHint: string;
}

/** Clickable legend entry: shows the period's revenue and toggles its series. */
const LegendToggle = memo(
  ({ label, color, total, active, onToggle, hiddenHint }: LegendToggleProps) => (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      title={`${label}: ${formatCurrency(total)} - ${hiddenHint}`}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all duration-200 ${
        active
          ? "border-gray-200 bg-white hover:border-brand/40"
          : "border-dashed border-gray-200 bg-transparent opacity-60 hover:opacity-100"
      }`}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: active ? color : "#e5e7eb" }}
      />
      <span className={`text-xs font-semibold ${active ? "text-gray-700" : "text-gray-400 line-through"}`}>
        {label}
      </span>
      <span className={`text-xs font-bold tabular-nums ${active ? "text-gray-900" : "text-gray-400"}`}>
        {formatCurrency(total)}
      </span>
    </button>
  )
);
LegendToggle.displayName = "LegendToggle";

/**
 * Daily paid revenue for the selected period vs the previous period.
 * The legend entries are live: each one reports its period's revenue total and
 * toggles that series on/off in the chart (at least one series always stays on).
 */
const SalesOverview = memo(({ current, previous, isLoading }: SalesOverviewProps) => {
  const [showCurrent, setShowCurrent] = useState(true);
  const [showPrevious, setShowPrevious] = useState(true);

  const currentTotal = current.reduce((sum, point) => sum + point.revenue, 0);
  const previousTotal = previous.reduce((sum, point) => sum + point.revenue, 0);

  const hasData = current.some((point) => point.revenue > 0) || previous.some((point) => point.revenue > 0);

  const data = current.map((point, index) => ({
    day: point.date,
    label: formatDayLabel(point.date),
    thisPeriod: point.revenue,
    lastPeriod: previous[index]?.revenue ?? 0,
  }));

  // Never blank the chart: hiding the only visible series is ignored.
  const toggleCurrent = () => setShowCurrent((value) => (showPrevious ? !value : true));
  const togglePrevious = () => setShowPrevious((value) => (showCurrent ? !value : true));

  return (
    <DashboardPanel
      title="Sales Overview"
      icon={<ChartIcon size={18} />}
      action={
        !isLoading && hasData ? (
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <LegendToggle
              label="This Period"
              color="#0e7c85"
              total={currentTotal}
              active={showCurrent}
              onToggle={toggleCurrent}
              hiddenHint="click to show this period"
            />
            <LegendToggle
              label="Last Period"
              color="#cbd5e1"
              total={previousTotal}
              active={showPrevious}
              onToggle={togglePrevious}
              hiddenHint="click to show last period"
            />
          </div>
        ) : undefined
      }
      className="h-full"
    >
      {isLoading ? (
        <PanelSkeleton height={260} />
      ) : !hasData ? (
        <PanelEmpty message="No sales yet" hint="Revenue trends will appear once orders come in." />
      ) : (
        <div className="h-[260px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesThisPeriod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e7c85" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0e7c85" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f7" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCompact}
                width={44}
              />
              <Tooltip
                cursor={{ stroke: "#0e7c85", strokeDasharray: "3 3" }}
                contentStyle={{ borderRadius: 12, border: "1px solid #e0f2f7", fontSize: 12 }}
                formatter={(value: unknown) => formatCurrency(Number(value))}
                labelFormatter={(_label: unknown, payload) => {
                  const day = payload?.[0]?.payload?.day as string | undefined;
                  return day ? formatDayLabel(day) : "";
                }}
              />
              {showPrevious && (
                <Area
                  type="monotone"
                  dataKey="lastPeriod"
                  name="Last Period"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  fill="none"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
              {showCurrent && (
                <Area
                  type="monotone"
                  dataKey="thisPeriod"
                  name="This Period"
                  stroke="#0e7c85"
                  strokeWidth={2.5}
                  fill="url(#salesThisPeriod)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardPanel>
  );
});
SalesOverview.displayName = "SalesOverview";

export default SalesOverview;
