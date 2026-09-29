import { memo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardPanel from "./DashboardPanel";
import { PanelEmpty, PanelSkeleton, LegendDot } from "./PanelStates";
import { TrendUpIcon } from "./icons";
import { formatDayLabel } from "../../../utils/formatDate";
import type { AnalyticsPoint } from "../../../types/order.types";

interface ProductDemandTrendsProps {
  current: AnalyticsPoint[];
  isLoading: boolean;
}

/**
 * Daily order demand for the selected period: units sold (bars) with the
 * order count (line) layered on top - the "how busy is the store" view that
 * complements the revenue-focused Sales Overview.
 */
const ProductDemandTrends = memo(({ current, isLoading }: ProductDemandTrendsProps) => {
  const hasData = current.some((point) => point.units > 0 || point.orders > 0);

  const data = current.map((point) => ({
    day: point.date,
    label: formatDayLabel(point.date),
    units: point.units,
    orders: point.orders,
  }));

  return (
    <DashboardPanel
      title="Product Demand Trends"
      icon={<TrendUpIcon size={18} />}
      action={
        !isLoading && hasData ? (
          <div className="flex items-center gap-4">
            <LegendDot color="#0e7c85" label="Units" />
            <LegendDot color="#3b82f6" label="Orders" />
          </div>
        ) : undefined
      }
      className="h-full"
    >
      {isLoading ? (
        <PanelSkeleton height={240} />
      ) : !hasData ? (
        <PanelEmpty message="No demand data yet" hint="Daily units and orders will chart here." />
      ) : (
        <div className="h-[240px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
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
                allowDecimals={false}
                width={38}
              />
              <Tooltip
                cursor={{ fill: "rgba(14,124,133,0.06)" }}
                contentStyle={{ borderRadius: 12, border: "1px solid #e0f2f7", fontSize: 12 }}
                formatter={(value: unknown, name: unknown) =>
                  `${Number(value)} ${name === "units" ? "units" : "orders"}`
                }
                labelFormatter={(_label: unknown, payload) => {
                  const day = payload?.[0]?.payload?.day as string | undefined;
                  return day ? formatDayLabel(day) : "";
                }}
              />
              <Bar dataKey="units" name="units" fill="#0e7c85" fillOpacity={0.85} radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Line
                type="monotone"
                dataKey="orders"
                name="orders"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardPanel>
  );
});
ProductDemandTrends.displayName = "ProductDemandTrends";

export default ProductDemandTrends;
