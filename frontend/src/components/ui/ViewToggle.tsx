export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/** Grid / list segmented icon toggle used across the admin manage pages. */
const ViewToggle = ({ viewMode, onChange }: ViewToggleProps) => (
  <div className="flex gap-0 bg-gray-200 p-1 rounded-lg">
    <button
      onClick={() => onChange("grid")}
      title="Grid View"
      className={`flex items-center justify-center p-2 rounded-l-md transition-all duration-200 ${
        viewMode === "grid" ? "bg-white text-brand shadow-md" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    </button>
    <button
      onClick={() => onChange("list")}
      title="List View"
      className={`flex items-center justify-center p-2 rounded-r-md transition-all duration-200 ${
        viewMode === "list" ? "bg-white text-brand shadow-md" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    </button>
  </div>
);

export default ViewToggle;
