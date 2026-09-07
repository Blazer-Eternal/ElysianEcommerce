import { useState, useRef, useEffect } from "react";
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
  // null = showing top-level parents. Otherwise, holds the parent whose children are shown.
  const [activeParent, setActiveParent] = useState<Category | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const parents = categories.filter((c) => !c.parent_id);
  const getChildren = (parentId: string) =>
    categories.filter((c) => {
      const pid = typeof c.parent_id === "object" ? c.parent_id?._id : c.parent_id;
      return pid === parentId;
    });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveParent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory = categories.find((c) => c._id === selectedId);
  const label = selectedCategory ? selectedCategory.name : "All Categories";

  const handlePick = (categoryId: string | undefined, categoryName: string | undefined) => {
    onSelect(categoryId, categoryName);
    setOpen(false);
    setActiveParent(null);
  };

  const visibleList = activeParent ? getChildren(activeParent._id) : parents;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
       className="border rounded-lg px-3 py-2 text-sm bg-white/70 flex items-center gap-2 min-w-40 justify-between"
      >
        <span className="truncate">{label}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] w-56 glass-strong rounded-xl shadow-lg py-1.5 text-sm z-50 max-h-72 overflow-y-auto">
          {activeParent && (
            <button
              type="button"
              onClick={() => setActiveParent(null)}
              className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-gray-500 hover:bg-white/60 border-b border-white/60"
            >
              <ArrowLeft />
              Back
            </button>
          )}

          {!activeParent && (
            <button
              type="button"
              onClick={() => handlePick(undefined, undefined)}
              className="w-full text-left px-3.5 py-2 hover:bg-white/60"
            >
              All Categories
            </button>
          )}

          {activeParent && (
            <div className="px-3.5 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
              {activeParent.name}
            </div>
          )}

          {activeParent && (
            <button
              type="button"
              onClick={() => handlePick(activeParent._id, activeParent.name)}
              className="w-full text-left px-3.5 py-2 hover:bg-white/60 font-medium"
            >
              All {activeParent.name}
            </button>
          )}

          {visibleList.map((cat) => {
            const children = getChildren(cat._id);
            const hasChildren = children.length > 0;

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => (hasChildren ? setActiveParent(cat) : handlePick(cat._id, cat.name))}
                className="w-full text-left px-3.5 py-2 hover:bg-white/60 flex items-center justify-between"
              >
                <span>{cat.name}</span>
                {hasChildren && <ChevronRight />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;