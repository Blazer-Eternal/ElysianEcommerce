import { memo, type ReactNode } from "react";

interface DashboardStatCardProps {
  label: string;
  /** Headline figure (lifetime total, or the period figure for ratio metrics). */
  value: string | number;
  icon: ReactNode;
  /** `bg-* text-*` tint classes for the pastel icon tile on the right. */
  iconClassName: string;
  /** Metric total accumulated during the selected period. */
  periodValue: number;
  /** Metric total from the immediately preceding period of the same length. */
  previousValue: number;
  periodDays: number;
  /**
   * `percent` (default) expresses the change relative to the previous period.
   * `points` expresses it in the metric's own unit (percentage points), which
   * is how rate metrics such as Conversion Rate should read.
   */
  deltaFormat?: "percent" | "points";
}

/** Scales the headline number down for long figures so nothing gets clipped. */
const valueSizeClass = (text: string): string => {
  if (text.length <= 8) return "text-3xl";
  if (text.length <= 12) return "text-2xl";
  return "text-xl";
};

/** Small trend arrow used by the comparison line (up / down / unchanged). */
const TrendArrow = ({ direction }: { direction: "up" | "down" | "flat" }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {direction === "up" && (
      <>
        <polyline points="3 17 9.5 10.5 13.5 14.5 21 7" />
        <polyline points="15 7 21 7 21 13" />
      </>
    )}
    {direction === "down" && (
      <>
        <polyline points="3 7 9.5 13.5 13.5 9.5 21 17" />
        <polyline points="15 17 21 17 21 11" />
      </>
    )}
    {direction === "flat" && (
      <>
        <polyline points="4 12 20 12" />
        <polyline points="15 7 20 12 15 17" />
      </>
    )}
  </svg>
);

/**
 * Top-row KPI card: label + headline number on the left, pastel icon tile on
 * the right, and the period-over-period change underneath (image-2 layout —
 * deliberately compact, no sparkline).
 */
const DashboardStatCard = memo(
  ({
    label,
    value,
    icon,
    iconClassName,
    periodValue,
    previousValue,
    periodDays,
    deltaFormat = "percent",
  }: DashboardStatCardProps) => {
    const delta = periodValue - previousValue;
    const isUp = delta > 0;
    const isDown = delta < 0;
    const direction = isUp ? "up" : isDown ? "down" : "flat";

    const magnitude =
      deltaFormat === "points"
        ? `${Math.abs(delta).toFixed(1)} pts`
        : previousValue > 0
          ? // Capped at 100%: raw ratios like 1228% read as noise.
            `${Math.min(Math.abs((delta / previousValue) * 100), 100).toFixed(0)}%`
          : `${Math.abs(delta)}`;

    const badgeClass = isUp ? "text-emerald-600" : isDown ? "text-rose-500" : "text-gray-400";
    const sign = delta === 0 ? "" : isUp ? "+" : "-";
    const badgeText = delta === 0 ? (deltaFormat === "points" ? "0.0 pts" : "0%") : `${sign}${magnitude}`;

    const valueText = String(value);
    const comparisonTitle =
      `${periodValue} during the last ${periodDays} days vs ` +
      `${previousValue} during the previous ${periodDays} days.`;

    return (
      <div className="glass rounded-2xl border border-gray-200 p-5 card-container hover-lift transition-smooth flex items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">{label}</p>

          <p
            className={`mt-2 font-extrabold text-gray-900 tracking-tight tabular-nums ${valueSizeClass(valueText)}`}
            title={valueText}
          >
            {valueText}
          </p>

          <p className="mt-2 flex items-center gap-1.5 min-w-0" title={comparisonTitle}>
            <span className={`inline-flex shrink-0 items-center gap-1 text-xs font-bold ${badgeClass}`}>
              <TrendArrow direction={direction} />
              {badgeText}
            </span>
            <span className="text-[11px] text-gray-400 truncate">vs previous {periodDays} days</span>
          </p>
        </div>

        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    );
  }
);
DashboardStatCard.displayName = "DashboardStatCard";

export default DashboardStatCard;
