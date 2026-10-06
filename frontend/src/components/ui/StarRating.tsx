interface StarRatingProps {
  /** Rating from 0 to 5, half stars (e.g. 3.5) are rendered partially filled. */
  value: number;
  /** Star size in pixels. */
  size?: number;
  className?: string;
  /** Tailwind text color class for the filled part of a star. */
  filledClassName?: string;
  /** Tailwind text color class for the empty background star. */
  emptyClassName?: string;
}

export const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

/** Read-only star row that fills each star by the exact fraction of the rating. */
const StarRating = ({
  value,
  size = 20,
  className = "",
  filledClassName = "text-[#f59e0b]",
  emptyClassName = "text-gray-300",
}: StarRatingProps) => {
  const safeValue = Math.min(5, Math.max(0, value || 0));

  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${safeValue} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fillPercent = Math.min(100, Math.max(0, (safeValue - index) * 100));

        return (
          <span
            key={index}
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            <svg
              className={`absolute inset-0 ${emptyClassName}`}
              width={size}
              height={size}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d={STAR_PATH} />
            </svg>
            {fillPercent > 0 && (
              <span
                className="absolute inset-y-0 left-0 block overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <svg
                  className={`block ${filledClassName}`}
                  width={size}
                  height={size}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d={STAR_PATH} />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
