import { memo } from "react";
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
import { PanelEmpty, PanelSkeleton, LegendDot } from "./PanelStates";
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

/** Daily paid revenue for the selected period vs the previous period. */
const SalesOverview = memo(({ current, previous, isLoading }: SalesOverviewProps) => {
  const hasData = current.some((point) => point.revenue > 0) || previous.some((point) => point.revenue > 0);

  const data = current.map((point, index) => ({
    day: point.date,
    label: formatDayLabel(point.date),
    thisPeriod: point.revenue,
    lastPeriod: previous[index]?.revenue ?? 0,
  }));

  return (
    <DashboardPanel
      title="Sales Overview"
      icon={<ChartIcon size={18} />}
      action={
        !isLoading && hasData ? (
          <div className="flex items-center gap-4">
            <LegendDot color="#0e7c85" label="This Period" />
            <LegendDot color="#cbd5e1" label="Last Period" />
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
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardPanel>
  );
});
SalesOverview.displayName = "SalesOverview";

export default SalesOverview;
