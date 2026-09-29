import { memo, type ReactNode } from "react";
import Sparkline from "./Sparkline";

interface DashboardStatCardProps {
  label: string;
  /** Lifetime figure shown in big type (e.g. total revenue ever recorded). */
  value: string | number;
  icon: ReactNode;
  /** `from-* to-*` gradient classes for the icon tile. */
  iconBg: string;
  /** Stroke color for the mini sparkline. */
  sparkColor: string;
  /** Metric total accumulated during the selected period. */
  periodValue: number;
  /** Metric total from the immediately preceding period of the same length. */
  previousValue: number;
  /** Daily series feeding the sparkline. */
  series: number[];
  periodDays: number;
}

/** Scales the headline number down for long figures so nothing gets clipped. */
const valueSizeClass = (text: string): string => {
  if (text.length <= 8) return "text-2xl sm:text-3xl";
  if (text.length <= 13) return "text-xl sm:text-2xl";
  return "text-lg sm:text-xl";
};

/**
 * Top-row KPI card (Total Revenue / Orders / Customers / Products): lifetime
 * total on the headline, the selected period compared against the previous
 * period underneath, and a sparkline of the daily series for that period.
 */
const DashboardStatCard = memo(
  ({ label, value, icon, iconBg, sparkColor, periodValue, previousValue, series, periodDays }: DashboardStatCardProps) => {
    const delta = periodValue - previousValue;
    const isUp = delta > 0;
    const isDown = delta < 0;
    // Percentage only means something when the previous period had activity;
    // otherwise fall back to the absolute change so the badge is never empty.
    const pct = previousValue > 0 ? (delta / previousValue) * 100 : null;
    const magnitude = pct === null ? `${Math.abs(delta)}` : `${Math.abs(pct).toFixed(0)}%`;

    const badgeClass = isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-500";
    const badgeText = delta === 0 ? "0" : `${isUp ? "▲" : "▼"} ${magnitude}`;

    const valueText = String(value);
    const comparisonTitle =
      `${periodValue} during the last ${periodDays} days vs ` +
      `${previousValue} during the previous ${periodDays} days.`;

    return (
      <div className="glass rounded-2xl border border-white/20 p-5 sm:p-6 card-container hover-lift transition-smooth">
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${iconBg} flex items-center justify-center text-white gpu-accelerate`}>
            {icon}
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>

        <p
          className={`mt-1 font-bold text-gray-900 tracking-tight tabular-nums ${valueSizeClass(valueText)}`}
          title={valueText}
        >
          {valueText}
        </p>

        <div className="flex items-end justify-between gap-3 mt-2">
          <p
            className="flex items-center gap-1.5 min-w-0 whitespace-nowrap"
            title={comparisonTitle}
          >
            <span className={`text-xs font-bold ${badgeClass}`}>{badgeText}</span>
            <span className="text-[11px] text-gray-400 truncate">vs. previous {periodDays} days</span>
          </p>
          <span title={`Daily ${label.toLowerCase()} over the last ${periodDays} days`} className="shrink-0">
            <Sparkline data={series} color={sparkColor} className="w-20 h-10" />
          </span>
        </div>
      </div>
    );
  }
);
DashboardStatCard.displayName = "DashboardStatCard";

export default DashboardStatCard;
