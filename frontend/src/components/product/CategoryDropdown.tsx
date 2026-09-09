import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { Category } from "../../types/category.types";

interface CategoryDropdownProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (categoryId: string | undefined, categoryName: string | undefined) => void;
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CategoryDropdown = ({ categories, selectedId, onSelect }: CategoryDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<Category | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const parents = categories.filter((c) => !c.parent_id);
  const getChildren = (parentId: string) =>
    categories.filter((c) => {
      const pid = typeof c.parent_id === "object" ? c.parent_id?._id : c.parent_id;
      return pid === parentId;
    });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = wrapperRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);
      if (!clickedTrigger && !clickedPanel) {
        setOpen(false);
        setActiveParent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useLayoutEffect + recompute whenever open OR activeParent changes,
  // since the panel's own height changes (parent list vs child list vs Back button)
  // and we always want it anchored freshly to the trigger button's current position.
  useLayoutEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: window.scrollY + rect.bottom + 6,
        left: window.scrollX + rect.left,
      });
    }
  }, [open, activeParent]);

  const selectedCategory = categories.find((c) => c._id === selectedId);
  const label = selectedCategory ? selectedCategory.name : "All Categories";

  const handlePick = (categoryId: string | undefined, categoryName: string | undefined) => {
    onSelect(categoryId, categoryName);
    setOpen(false);
    setActiveParent(null);
  };

  const visibleList = activeParent ? getChildren(activeParent._id) : parents;

  return (
    <>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="border rounded-lg px-3 py-2 text-sm bg-white/70 flex items-center gap-2 min-w-40 justify-between"
        >
          <span className="truncate">{label}</span>
          <ChevronDown />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed w-56 bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5 text-sm z-9999 max-h-72 overflow-y-auto"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {activeParent && (
              <button
                type="button"
                onClick={() => setActiveParent(null)}
                className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-gray-500 hover:bg-gray-50 border-b border-gray-200"
              >
                <ArrowLeft />
                Back
              </button>
            )}

            {!activeParent && (
              <button
                type="button"
                onClick={() => handlePick(undefined, undefined)}
                className="w-full text-left px-3.5 py-2 hover:bg-gray-50"
              >
                All Categories
              </button>
            )}

            {activeParent && (
              <div className="px-3.5 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                {activeParent.name}
              </div>
            )}

            {visibleList.map((cat) => {
              const children = getChildren(cat._id);
              const hasChildren = children.length > 0;

              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => (hasChildren ? setActiveParent(cat) : handlePick(cat._id, cat.name))}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  {hasChildren && <ChevronRight />}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};

export default CategoryDropdown;
