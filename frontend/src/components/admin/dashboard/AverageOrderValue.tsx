import { memo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty, PanelSkeleton } from "./PanelStates";
import { TargetIcon } from "./icons";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDayLabel } from "../../../utils/formatDate";
import type { AnalyticsPoint, AnalyticsTotals } from "../../../types/order.types";

interface AverageOrderValueProps {
  current: AnalyticsPoint[];
  totals: { current: AnalyticsTotals; previous: AnalyticsTotals };
  isLoading: boolean;
}

const aovOf = (totals: AnalyticsTotals): number =>
  totals.paidOrders > 0 ? Math.round((totals.revenue / totals.paidOrders) * 100) / 100 : 0;

/** Period AOV headline plus the daily average order value trend. */
const AverageOrderValue = memo(({ current, totals, isLoading }: AverageOrderValueProps) => {
  const aov = aovOf(totals.current);
  const previousAov = aovOf(totals.previous);

  const changePct =
    previousAov > 0 ? ((aov - previousAov) / previousAov) * 100 : aov > 0 ? null : 0;
  const isUp = (changePct ?? 0) > 0;
  const isDown = (changePct ?? 0) < 0;
  const badgeClass = changePct === null ? "text-[#0e7c85]" : isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-500";
  const badgeText = changePct === null ? "New" : `${isUp ? "▲" : isDown ? "▼" : ""} ${Math.abs(changePct).toFixed(0)}%`;

  const data = current.map((point) => ({
    day: point.date,
    label: formatDayLabel(point.date),
    aov: point.paidOrders > 0 ? Math.round((point.revenue / point.paidOrders) * 100) / 100 : null,
  }));
  const hasTrend = data.some((point) => point.aov !== null);

  return (
    <DashboardPanel title="Average Order Value" icon={<TargetIcon size={18} />} className="h-full">
      {isLoading ? (
        <PanelSkeleton height={240} />
      ) : (
        <>
          <div className="flex items-end justify-between gap-3 mb-4">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(aov)}</p>
            <p className="flex items-center gap-1.5 text-xs whitespace-nowrap">
              <span className={`font-bold ${badgeClass}`}>{badgeText}</span>
              <span className="text-gray-400">vs. last period</span>
            </p>
          </div>

          {hasTrend ? (
            <div className="h-[168px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    width={44}
                    tickFormatter={(value: number) =>
                      value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
                    }
                  />
                  <Tooltip
                    cursor={{ stroke: "#f59e0b", strokeDasharray: "3 3" }}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e0f2f7", fontSize: 12 }}
                    formatter={(value: unknown) => formatCurrency(Number(value))}
                    labelFormatter={(_label: unknown, payload) => {
                      const day = payload?.[0]?.payload?.day as string | undefined;
                      return day ? formatDayLabel(day) : "";
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="aov"
                    name="AOV"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    connectNulls
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty message="No paid orders yet" hint="Daily AOV trends once payments land." />
          )}
        </>
      )}
    </DashboardPanel>
  );
});
AverageOrderValue.displayName = "AverageOrderValue";

export default AverageOrderValue;
