import { useRef, useState, type MouseEvent } from "react";
import { STAR_PATH } from "./StarRating";

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  disabled?: boolean;
}

/**
 * Interactive rating widget: clicking a star selects that full star (1–5).
 * Half stars are not selectable — only whole numbers.
 * Shows a live preview while hovering, like the review form has always done.
 */
const StarPicker = ({ value, onChange, size = 24, disabled = false }: StarPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const ratingFromEvent = (e: MouseEvent<HTMLDivElement>): number | null => {
    const container = containerRef.current;
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < 0 || x > rect.width) return null;

    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const newRating = starIndex + 1;

    return Math.max(1, Math.min(5, newRating));
  };

  const preview = hovered ?? value;

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        if (disabled) return;
        const rating = ratingFromEvent(e);
        if (rating !== null) setHovered(rating);
      }}
      onMouseLeave={() => setHovered(null)}
      onClick={(e) => {
        if (disabled) return;
        const rating = ratingFromEvent(e);
        if (rating !== null) {
          onChange(rating);
          setHovered(null);
        }
      }}
      className={`inline-flex gap-1 ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer transition-transform hover:scale-105"
      }`}
      role="radiogroup"
      aria-label="Select a rating"
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const fillPercent = Math.min(100, Math.max(0, (preview - (starIndex - 1)) * 100));

        return (
          <span
            key={starIndex}
            className="relative inline-block"
            style={{ width: size, height: size }}
            role="radio"
            aria-checked={value >= starIndex}
            aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
          >
            <svg
              className="absolute inset-0 text-gray-300"
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
                  className="block text-[#f59e0b]"
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

export default StarPicker;
