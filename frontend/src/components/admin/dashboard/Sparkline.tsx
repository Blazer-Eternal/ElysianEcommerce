import { memo } from "react";

interface SparklineProps {
  /** Daily series backing the sparkline (same length as the chart period). */
  data: number[];
  color: string;
  className?: string;
}

/**
 * Dependency-free mini trend line for the stat cards. Normalizes the series
 * into a 100x32 viewBox; a flat (all-zero) series renders as a baseline stroke
 * rather than dividing by zero.
 */
const Sparkline = memo(({ data, color, className = "w-24 h-10" }: SparklineProps) => {
  if (data.length === 0) return null;

  const width = 100;
  const height = 32;
  const pad = 3;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    // Even spread for flat series so the line sits in the middle of the pad.
    const y = range === 0 ? height / 2 : height - pad - ((value - min) / range) * (height - pad * 2);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  const gradientId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
});
Sparkline.displayName = "Sparkline";

export default Sparkline;
