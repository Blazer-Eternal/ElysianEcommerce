import { memo } from "react";
import { CalendarIcon, ChevronDownIcon } from "./icons";

const PERIOD_OPTIONS = [7, 30, 90] as const;
export type PeriodDays = (typeof PERIOD_OPTIONS)[number];

interface PeriodSelectorProps {
  value: PeriodDays;
  onChange: (days: PeriodDays) => void;
}

/** "Last 7/30/90 Days" dropdown that drives every chart on the dashboard. */
const PeriodSelector = memo(({ value, onChange }: PeriodSelectorProps) => (
  <div className="relative shrink-0">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
      <CalendarIcon size={16} />
    </span>
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value) as PeriodDays)}
      aria-label="Analytics period"
      className="appearance-none bg-white border border-[#ece1d0] rounded-xl pl-9 pr-9 py-2.5 text-sm font-semibold text-gray-700 cursor-pointer transition-fast focus:outline-none focus:ring-2 focus:ring-brand/30 hover:border-brand/30"
    >
      {PERIOD_OPTIONS.map((days) => (
        <option key={days} value={days}>
          Last {days} Days
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
      <ChevronDownIcon size={16} />
    </span>
  </div>
));
PeriodSelector.displayName = "PeriodSelector";

export default PeriodSelector;
