import type { PaginationResult } from "../../types/pagination.types";

interface PaginationProps {
  pagination: PaginationResult;
  onPageChange: (page: number) => void;
}

const arrowButton =
  "px-3.5 py-1.5 rounded-xl border border-brand/30 bg-white text-sm font-medium text-brand transition-colors hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white";

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className={arrowButton}
      >
        Prev
      </button>

      <span className="text-xs px-3 py-1.5 rounded-full bg-brand text-white font-semibold tracking-wide whitespace-nowrap">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className={arrowButton}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
