import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import type { ReviewSort } from "../../types/review.types";
import type { PaginationResult } from "../../types/pagination.types";
import ReviewSummary from "./ReviewSummary";
import ReviewForm from "./ReviewForm";
import ReviewList, { PAGE_SIZE_OPTIONS } from "./ReviewList";

const EMPTY_PAGINATION: PaginationResult = {
  total: 0,
  page: 1,
  limit: PAGE_SIZE_OPTIONS,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

interface ReviewSectionProps {
  productId: string;
}

/**
 * Owns review state (page / sort / star filter) and the single query that feeds
 * the rating summary, the form (via myReview) and the paginated list — so every
 * part stays in sync when a review is created, edited or deleted.
 */
const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["reviews", productId, { page, sort, rating: ratingFilter ?? 0 }],
    queryFn: ({ signal }) =>
      reviewService.getByProduct(productId, {
        page,
        limit: PAGE_SIZE_OPTIONS,
        sort,
        rating: ratingFilter ?? undefined,
        signal,
      }),
    placeholderData: keepPreviousData,
  });

  const pagination = data?.pagination ?? EMPTY_PAGINATION;

  // Deleting the last review on a page (or narrowing the filter) must not leave
  // us stranded on a page that no longer exists — adjusted during render.
  const [prevTotalPages, setPrevTotalPages] = useState(pagination.totalPages);
  if (pagination.totalPages !== prevTotalPages) {
    setPrevTotalPages(pagination.totalPages);
    setPage((current) => Math.min(current, pagination.totalPages));
  }

  const handleSortChange = (nextSort: ReviewSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleRatingFilterChange = (nextFilter: number | null) => {
    setRatingFilter(nextFilter);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <ReviewSummary
        stats={data?.stats}
        activeFilter={ratingFilter}
        onStarFilter={handleRatingFilterChange}
      />

      <ReviewForm
        key={data?.myReview?._id ?? "create"}
        productId={productId}
        myReview={data?.myReview ?? null}
        onCreated={() => {
          // Jump to where the new review actually lands: newest-first, page 1
          setSort("recent");
          setRatingFilter(null);
          setPage(1);
        }}
      />

      <ReviewList
        productId={productId}
        reviews={data?.data ?? []}
        pagination={pagination}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        sort={sort}
        ratingFilter={ratingFilter}
        onSortChange={handleSortChange}
        onRatingFilterChange={handleRatingFilterChange}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ReviewSection;
