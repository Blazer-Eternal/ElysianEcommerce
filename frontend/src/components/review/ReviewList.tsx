import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { reviewService } from "../../services/reviewService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatDate } from "../../utils/formatDate";
import StarRating from "../ui/StarRating";
import StarPicker from "../ui/StarPicker";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Review, ReviewSort } from "../../types/review.types";
import type { PaginationResult } from "../../types/pagination.types";

const PAGE_SIZE_OPTIONS = 10;

const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating_desc", label: "Rating: High to Low" },
  { value: "rating_asc", label: "Rating: Low to High" },
];

const RATING_FILTER_OPTIONS = [
  { value: "", label: "All star" },
  { value: "5", label: "5 star" },
  { value: "4", label: "4 star" },
  { value: "3", label: "3 star" },
  { value: "2", label: "2 star" },
  { value: "1", label: "1 star" },
];

const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
};

interface DropdownProps {
  icon: ReactNode;
  title: string;
  selectedLabel: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

/** Toolbar dropdown (sort / star filter) that closes on outside click or Escape. */
const Dropdown = ({ icon, title, selectedLabel, options, onSelect }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:text-purple-700 transition-colors"
      >
        <span className="text-gray-400">{icon}</span>
        <span>
          {title}: <span className="font-semibold text-purple-700">{selectedLabel}</span>
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-30 min-w-[190px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-1"
        >
          {options.map((option) => (
            <button
              key={option.value || "all"}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
  productId: string;
  isOwner: boolean;
}

const ReviewCard = ({ review, productId, isOwner }: ReviewCardProps) => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUp, setMenuUp] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || "");
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const author =
    typeof review.user_id === "object" && review.user_id ? review.user_id : null;
  const authorName = author?.name || "Anonymous";

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: { rating: number; comment?: string }) => reviewService.update(review._id, payload),
    onSuccess: () => {
      setEditing(false);
      setError(null);
      invalidate();
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => reviewService.remove(review._id),
    onSuccess: () => {
      setConfirmingDelete(false);
      invalidate();
    },
    onError: (err) => {
      setError(getErrorMessage(err));
      setConfirmingDelete(false);
    },
  });

  // Close the ⋯ menu when clicking outside it, pressing Escape, or scrolling —
  // the menu is positioned from the button's rect, so a scroll would strand it.
  useEffect(() => {
    if (!menuOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const handleViewportChange = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [menuOpen]);

  const startEditing = () => {
    setMenuOpen(false);
    setRating(review.rating);
    setComment(review.comment || "");
    setError(null);
    setEditing(true);
  };

  const saveEdit = () => {
    setError(null);
    updateMutation.mutate({ rating, comment: comment.trim() || undefined });
  };

  if (editing) {
    return (
      <div
        className="p-6 bg-linear-to-br from-white via-purple-50/50 to-blue-50/40 border-2 border-purple-300 rounded-2xl shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Edit your review</h4>
          <span className="text-xs font-semibold text-purple-600 bg-purple-100 rounded-full px-2.5 py-1">
            Editing
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Rating
            </span>
            <div className="flex items-center gap-3">
              <StarPicker value={rating} onChange={setRating} size={26} disabled={updateMutation.isPending} />
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                {rating}/5
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Hover and click to select a full star rating (1–5)
            </p>
          </div>

          <div>
            <label
              htmlFor={`edit-comment-${review._id}`}
              className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide"
            >
              Comment
            </label>
            <textarea
              id={`edit-comment-${review._id}`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Tell us about your experience... (optional)"
              className="w-full p-3 border-2 border-purple-200/60 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300/50 transition-all duration-300 resize-none text-sm"
            />
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-xs text-gray-500">Character count:</span>
              <span
                className={`text-xs font-semibold ${
                  comment.length > 900 ? "text-orange-600" : "text-gray-600"
                }`}
              >
                {comment.length}/1000
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
              ❌ {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              onClick={saveEdit}
              isLoading={updateMutation.isPending}
              className="bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => setExpanded((value) => !value)}
        className={`group relative p-6 bg-linear-to-br from-white via-blue-50/30 to-purple-50/20 border-2 border-purple-200/40 rounded-2xl hover:border-purple-300 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-300/20 ${
          menuOpen ? "review-menu-open" : ""
        }`}
      >
        {/*
          Glows live in their own clipped layer: the card itself must NOT clip
          (overflow-hidden), otherwise the owner's ⋯ dropdown gets cut off.
        */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-purple-300 to-pink-300 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-linear-to-br from-indigo-300 to-blue-300 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {authorName}
                    {isOwner && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-purple-600 bg-purple-100 rounded-full px-2 py-0.5 align-middle">
                        You
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRating value={review.rating} size={18} />
                    <span className="text-xs font-semibold text-yellow-600">{review.rating}/5</span>
                    <span className="text-xs text-gray-400">• {relativeTime(review.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner actions: ⋯ → Edit / Delete */}
            {isOwner && (
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  aria-label="Review options"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={(event) => {
                    event.stopPropagation();
                    const willOpen = !menuOpen;
                    if (willOpen) {
                      // Open downward normally; flip up when the viewport has no
                      // room below the button (last review in view).
                      const rect = event.currentTarget.getBoundingClientRect();
                      const spaceBelow = window.innerHeight - rect.bottom;
                      const spaceAbove = rect.top;
                      const MENU_HEIGHT = 116;
                      setMenuUp(spaceBelow < MENU_HEIGHT && spaceAbove > spaceBelow);
                    }
                    setMenuOpen(willOpen);
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 ${
                    menuOpen ? "bg-purple-100 text-purple-700" : ""
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    onClick={(event) => event.stopPropagation()}
                    className={`absolute right-0 z-40 w-44 review-menu-pop ${
                      menuUp
                        ? "bottom-full mb-2 origin-bottom-right"
                        : "top-full mt-2 origin-top-right"
                    }`}
                  >
                    {/* Caret anchoring the menu to the ⋯ button */}
                    <span
                      aria-hidden="true"
                      className={`absolute right-4 w-2.5 h-2.5 rotate-45 bg-white border-gray-200 ${
                        menuUp ? "-bottom-[5px] border-b border-r" : "-top-[5px] border-t border-l"
                      }`}
                    />
                    <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={(event) => {
                          event.stopPropagation();
                          startEditing();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <span aria-hidden="true">✏️</span> Edit
                      </button>
                      <div className="h-px bg-gray-100 mx-3" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={(event) => {
                          event.stopPropagation();
                          setMenuOpen(false);
                          setError(null);
                          setConfirmingDelete(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span aria-hidden="true">🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {review.verified_purchase && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 mb-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-sm">
              ✓ Verified Purchase
            </span>
          )}

          {review.comment && (
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                expanded ? "max-h-[500px] opacity-100" : "max-h-12 opacity-90"
              }`}
            >
              <p className="text-sm leading-relaxed text-gray-700 italic">
                "{review.comment}"
              </p>
            </div>
          )}

          {review.comment && review.comment.length > 100 && !expanded && (
            <p className="text-xs text-purple-600 font-semibold mt-2">→ Click to expand</p>
          )}
          {expanded && review.comment && review.comment.length > 100 && (
            <p className="text-xs text-purple-600 font-semibold mt-2">→ Click to collapse</p>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="Delete this review?"
      >
        <p className="text-sm text-gray-600 mb-6">
          Your review of <span className="font-semibold">{authorName}</span> will be removed and the
          product rating will be recalculated. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmingDelete(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

const getPageItems = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((page) => pages.add(page));

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) items.push("ellipsis");
    items.push(page);
    previous = page;
  }
  return items;
};

interface ReviewListProps {
  productId: string;
  reviews: Review[];
  pagination: PaginationResult;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  sort: ReviewSort;
  ratingFilter: number | null;
  onSortChange: (sort: ReviewSort) => void;
  onRatingFilterChange: (rating: number | null) => void;
  onPageChange: (page: number) => void;
}

const ReviewList = ({
  productId,
  reviews,
  pagination,
  isLoading,
  isFetching,
  isError,
  sort,
  ratingFilter,
  onSortChange,
  onRatingFilterChange,
  onPageChange,
}: ReviewListProps) => {
  const { user } = useAuth();

  const ownerIdOf = (review: Review) =>
    typeof review.user_id === "object" && review.user_id ? review.user_id._id : review.user_id;

  // Only the author themselves — admins are NOT given edit rights over other
  // people's reviews (the API would reject it anyway with 403).
  const isOwnerOf = (review: Review) => {
    const ownerId = ownerIdOf(review);
    return Boolean(user?.id && ownerId && ownerId === user.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="p-4 bg-linear-to-r from-gray-100 to-gray-50 rounded-2xl animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-linear-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl text-center">
        <span className="text-2xl mb-2 block">⚠️</span>
        <p className="text-red-700 font-semibold">Error loading reviews</p>
        <p className="text-red-600 text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  const filtered = Boolean(ratingFilter);
  const hasReviews = pagination.total > 0;

  if (!hasReviews || reviews.length === 0) {
    return (
      <div className="space-y-6">
        <Toolbar
          sort={sort}
          ratingFilter={ratingFilter}
          onSortChange={onSortChange}
          onRatingFilterChange={onRatingFilterChange}
        />
        <div className="text-center py-16 px-6 bg-linear-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 rounded-3xl border-2 border-dashed border-purple-200/50 hover:border-purple-300 transition-all duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-purple-200 to-pink-200 mb-6">
            <span className="text-4xl">{filtered ? "🔍" : "💬"}</span>
          </div>
          <p className="text-gray-900 font-bold text-lg mb-2">
            {filtered ? `No ${ratingFilter}-star reviews yet` : "No reviews yet"}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
            {filtered
              ? "Try a different star filter to see what other customers said."
              : "Be the first to share your thoughts about this amazing product! Your feedback helps others make informed decisions."}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={() => onRatingFilterChange(null)}
              className="mt-4 text-sm font-semibold text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-full px-4 py-2 transition-colors"
            >
              Show all reviews
            </button>
          )}
        </div>
      </div>
    );
  }

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.total, pagination.page * pagination.limit);

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes menu-pop {
          from { opacity: 0; transform: translateY(-6px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .review-menu-pop {
          animation: menu-pop 0.16s ease-out both;
        }
        /* Lift the open card so its dropdown paints above the reviews below it */
        .review-card:has(.review-menu-open) {
          position: relative;
          z-index: 30;
        }
        @media (prefers-reduced-motion: reduce) {
          .review-menu-pop { animation: none; }
        }
      `}</style>

      <Toolbar
        sort={sort}
        ratingFilter={ratingFilter}
        onSortChange={onSortChange}
        onRatingFilterChange={onRatingFilterChange}
      />

      {/* Refetch indicator */}
      <div className={`h-0.5 w-full rounded-full overflow-hidden transition-opacity duration-300 ${isFetching ? "opacity-100 bg-purple-200" : "opacity-0"}`}>
        <div className="h-full w-1/3 bg-purple-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="review-card"
          >
            <ReviewCard
              review={review}
              productId={productId}
              isOwner={isOwnerOf(review)}
            />
          </div>
        ))}
      </div>

      {/* Range + pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <p className="text-xs text-gray-500 font-medium">
          Showing {start}–{end} of {pagination.total} {pagination.total === 1 ? "review" : "reviews"}
          {filtered ? ` (${ratingFilter}★ only)` : ""}
        </p>

        {pagination.totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Reviews pagination">
            <button
              type="button"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || isFetching}
              aria-label="Previous page"
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              ‹
            </button>

            {getPageItems(pagination.page, pagination.totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-1.5 text-sm text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  disabled={isFetching}
                  aria-current={item === pagination.page ? "page" : undefined}
                  className={`min-w-[2rem] px-2 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${
                    item === pagination.page
                      ? "bg-linear-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md"
                      : "border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage || isFetching}
              aria-label="Next page"
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            >
              ›
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

interface ToolbarProps {
  sort: ReviewSort;
  ratingFilter: number | null;
  onSortChange: (sort: ReviewSort) => void;
  onRatingFilterChange: (rating: number | null) => void;
}

const Toolbar = ({ sort, ratingFilter, onSortChange, onRatingFilterChange }: ToolbarProps) => {
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label || "Most Recent";
  const filterLabel = ratingFilter ? `${ratingFilter} star` : "All star";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-lg font-bold text-gray-900">Product Reviews</h3>

      <div className="flex flex-wrap items-center gap-2">
        <Dropdown
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          }
          title="Sort"
          selectedLabel={sortLabel}
          options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          onSelect={(value) => onSortChange(value as ReviewSort)}
        />

        <Dropdown
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          }
          title="Filter"
          selectedLabel={filterLabel}
          options={RATING_FILTER_OPTIONS}
          onSelect={(value) => onRatingFilterChange(value ? Number(value) : null)}
        />
      </div>
    </div>
  );
};

export { PAGE_SIZE_OPTIONS };
export default ReviewList;
