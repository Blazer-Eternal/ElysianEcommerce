import { memo } from "react";

/** Centered placeholder shown when a panel has no data for the period yet. */
export const PanelEmpty = memo(({ message, hint }: { message: string; hint?: string }) => (
  <div className="flex-1 min-h-[180px] flex flex-col items-center justify-center text-center py-8">
    <span className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 20h16a1 1 0 0 0 0-2H5V4a1 1 0 0 0-2 0v15a1 1 0 0 0 1 1zm3-5V9h3v6H7zm5 0V6h3v9h-3zm5 0v-4h3v4h-3z" />
      </svg>
    </span>
    <p className="text-sm font-semibold text-gray-600">{message}</p>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
));
PanelEmpty.displayName = "PanelEmpty";

/** Shimmer placeholder used while analytics queries are in flight. */
export const PanelSkeleton = memo(({ height = 240 }: { height?: number }) => (
  <div className="skeleton w-full rounded-xl" style={{ height }} />
));
PanelSkeleton.displayName = "PanelSkeleton";

/** Legend dot used in chart panel headers ("This Period" / "Last Period"). */
export const LegendDot = memo(({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 whitespace-nowrap">
    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    {label}
  </span>
));
LegendDot.displayName = "LegendDot";
