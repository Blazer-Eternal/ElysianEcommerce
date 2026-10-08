import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import {
  PRICE_RANGES,
  priceRangeKey,
  priceRangeLabel,
  type PriceRange,
} from "../../constants/priceRanges";

interface PriceDropdownProps {
  /** Currently selected range keys, read from `filters.priceRanges`. */
  selected: Set<string>;
  onToggle: (range: PriceRange) => void;
  onClear: () => void;
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * Price bucket picker that lives inline in the filter toolbar row (next to the
 * category dropdown) instead of taking up a full block of the filter card.
 * The panel is portalled and anchored to the trigger, same as CategoryDropdown.
 */
const PriceDropdown = ({ selected, onToggle, onClear }: PriceDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!wrapperRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Re-anchor whenever it opens: the panel height changes with the selection,
  // and the filter card itself sits inside a scrollable page.
  useLayoutEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPanelPosition({
        top: window.scrollY + rect.bottom + 6,
        left: window.scrollX + rect.left,
      });
    }
  }, [open]);

  const count = selected.size;

  return (
    <>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="true"
          className="border border-[#ece1d0] rounded-lg px-3 py-2 text-sm bg-white flex items-center gap-2 justify-between hover:border-brand/40 hover:text-brand transition-colors min-w-36"
        >
          <span className="flex items-center gap-1.5">
            <span>Price</span>
            {count > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center leading-none">
                {count}
              </span>
            )}
          </span>
          <ChevronDown />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed w-72 bg-white border border-[#ece1d0] rounded-xl shadow-xl py-2 text-sm z-9999"
            style={{ top: `${panelPosition.top}px`, left: `${panelPosition.left}px` }}
          >
            <div className="flex items-center justify-between gap-2 px-3.5 pb-2 mb-1 border-b border-[#ece1d0]">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Price range
              </span>
              {count > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <ul className="px-2 py-1 grid gap-0.5 max-h-72 overflow-y-auto">
              {PRICE_RANGES.map((range) => {
                const key = priceRangeKey(range);
                return (
                  <li key={key}>
                    <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-cream cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selected.has(key)}
                        onChange={() => onToggle(range)}
                        className="accent-brand"
                      />
                      <span>{priceRangeLabel(range)}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
};

export default PriceDropdown;
