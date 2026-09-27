import StarRating from "../ui/StarRating";
import type { ReviewStats } from "../../types/review.types";

interface ReviewSummaryProps {
  stats?: ReviewStats;
  activeFilter?: number | null;
  onStarFilter?: (star: number | null) => void;
}

const pluralize = (count: number) => `${count} ${count === 1 ? "Rating" : "Ratings"}`;

/** Big average + star bars breakdown (5 → 1). Clicking a bar filters the list by that star. */
const ReviewSummary = ({ stats, activeFilter = null, onStarFilter }: ReviewSummaryProps) => {
  if (!stats) {
    return (
      <div className="p-6 rounded-2xl bg-white/70 border border-purple-100 animate-pulse h-40" aria-hidden="true" />
    );
  }

  const { average, count, distribution } = stats;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 rounded-2xl bg-white/80 border border-purple-100 shadow-sm">
      {/* Overall score */}
      <div className="flex flex-col items-center md:items-start justify-center min-w-[150px]">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-black text-gray-900 leading-none">
            {average.toFixed(1)}
          </span>
          <span className="text-xl font-semibold text-gray-400 mb-1">/5</span>
        </div>
        <StarRating value={average} size={26} className="mt-2" />
        <p className="text-sm text-gray-500 font-medium mt-2">{pluralize(count)}</p>
      </div>

      {/* Per-star breakdown */}
      <div className="flex-1 grid gap-2">
        {distribution.map(({ star, count: starCount, percentage }) => {
          const isActive = activeFilter === star;
          const barWidth = starCount > 0 ? Math.max(4, percentage) : 0;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onStarFilter?.(isActive ? null : star)}
              aria-pressed={isActive}
              aria-label={`Filter reviews with ${star} star${star > 1 ? "s" : ""}`}
              title={onStarFilter ? `Show ${star}-star reviews` : undefined}
              className={`flex items-center gap-3 px-2 py-1 rounded-lg transition-colors duration-200 ${
                onStarFilter ? "hover:bg-purple-50 cursor-pointer" : "cursor-default"
              } ${isActive ? "bg-purple-100 ring-1 ring-purple-300" : ""}`}
            >
              <StarRating value={star} size={16} className="w-[88px] shrink-0" />
              <span className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                <span
                  className={`block h-full rounded-full transition-all duration-500 ${
                    isActive ? "bg-purple-500" : "bg-yellow-400"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </span>
              <span className="w-10 text-right text-sm font-semibold text-gray-600 tabular-nums">
                {starCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active filter chip */}
      {activeFilter && onStarFilter && (
        <div className="flex items-start">
          <button
            type="button"
            onClick={() => onStarFilter(null)}
            className="text-xs font-semibold text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-full px-3 py-1.5 transition-colors"
          >
            Clear {activeFilter}★ filter ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
