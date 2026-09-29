import { memo, type ReactNode } from "react";
import Sparkline from "./Sparkline";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  /** `from-* to-*` gradient classes for the icon tile. */
  iconBg: string;
  /** Stroke color for the mini sparkline. */
  sparkColor: string;
  /** Percent change vs the previous period; null = no previous data. */
  changePct: number | null;
  /** Daily series feeding the sparkline. */
  series: number[];
  periodDays: number;
}

/**
 * Top-row KPI card (Total Sales / Orders / Customers / Products) with a
 * period-over-period change badge and a mini trend line - mirrors the
 * reference dashboard's stat tiles.
 */
const DashboardStatCard = memo(
  ({ label, value, icon, iconBg, sparkColor, changePct, series, periodDays }: DashboardStatCardProps) => {
    const isNew = changePct === null;
    const isUp = (changePct ?? 0) > 0;
    const isDown = (changePct ?? 0) < 0;

    const badgeClass = isNew
      ? "text-[#0e7c85]"
      : isUp
        ? "text-green-600"
        : isDown
          ? "text-red-500"
          : "text-gray-500";

    const badgeText = isNew
      ? "New"
      : `${isUp ? "▲" : isDown ? "▼" : ""} ${Math.abs(changePct ?? 0).toFixed(0)}%`;

    return (
      <div className="glass rounded-2xl border border-white/20 p-5 sm:p-6 card-container hover-lift transition-smooth">
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${iconBg} flex items-center justify-center text-white gpu-accelerate`}>
            {icon}
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>

        <div className="flex items-end justify-between gap-3 mt-1">
          <div className="min-w-0">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{value}</p>
            <p className="flex items-center gap-1.5 mt-1.5 whitespace-nowrap">
              <span className={`text-xs font-bold ${badgeClass}`}>{badgeText}</span>
              <span className="text-xs text-gray-400">vs. last {periodDays} days</span>
            </p>
          </div>
          <Sparkline data={series} color={sparkColor} className="w-20 h-10 shrink-0" />
        </div>
      </div>
    );
  }
);
DashboardStatCard.displayName = "DashboardStatCard";

export default DashboardStatCard;
