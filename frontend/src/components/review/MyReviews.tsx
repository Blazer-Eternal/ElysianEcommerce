import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";import { reviewService } from "../../services/reviewService";
import { ROUTES } from "../../constants/routes";
import { formatRelativeTime } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { cloudinaryImg } from "../../utils/imageUrl";
import StarRating from "../ui/StarRating";
import StarPicker from "../ui/StarPicker";
import Modal from "../ui/Modal";
import Pagination from "../ui/Pagination";
import Spinner from "../ui/Spinner";
import { BoxIcon, PencilIcon, TrashIcon, StarIcon } from "../icons";
import type { MyReview } from "../../types/review.types";

const PAGE_SIZE = 8;
const COMMENT_MAX = 1000;

interface MyReviewsProps {
  /** Rendered on the empty state so the customer can go find a product to rate. */
  onBrowseProducts?: () => void;
}

const ProductImage = ({ review }: { review: MyReview }) => {
  const src = review.product?.images?.[0];

  if (!review.product) {
    return (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-sand bg-cream-deep/60 text-ink/40">
        <BoxIcon size={18} />
      </div>
    );
  }

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL(review.product._id)}
      className="shrink-0 overflow-hidden rounded-xl border border-sand bg-white transition-colors hover:border-brand/40"
    >
      <img
        src={cloudinaryImg(src ?? "", 200)}
        alt={review.product.name}
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        className="h-20 w-20 object-cover"
      />
    </Link>
  );
};

/**
 * The signed-in customer's own reviews, grouped per product.
 *
 * Editing reuses `PATCH /reviews/:id` and deleting `DELETE /reviews/:id` — the
 * exact endpoints the product page already uses, so a change here is instantly
 * reflected on the product's public review list (both invalidate the same
 * `["reviews", productId]` cache entry).
 */
const MyReviews = ({ onBrowseProducts }: MyReviewsProps) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<MyReview | null>(null);
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<MyReview | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-reviews", page],
    queryFn: ({ signal }) => reviewService.getMyReviews(page, PAGE_SIZE, { signal }),
  });

  const afterChange = (productId?: string | null) => {
    queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
    if (productId) {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      rating,
      comment,
    }: {
      id: string;
      rating: number;
      comment: string;
      productId: string | null;
    }) => reviewService.update(id, { rating, comment: comment.trim() || undefined }),
    onSuccess: (_data, variables) => {
      setEditing(null);
      setNotice({ tone: "ok", text: "Review updated." });
      afterChange(variables.productId);
    },
    onError: (error) => setNotice({ tone: "bad", text: getErrorMessage(error) }),
  });

  const deleteMutation = useMutation({
    mutationFn: (review: MyReview) => reviewService.remove(review._id),
    onSuccess: (_data, review) => {
      setConfirmDelete(null);
      setNotice({ tone: "ok", text: "Review deleted." });
      afterChange(review.product?._id);
    },
    onError: (error) => setNotice({ tone: "bad", text: getErrorMessage(error) }),
  });

  const startEditing = (review: MyReview) => {
    setNotice(null);
    setEditing(review);
    setDraftRating(review.rating);
    setDraftComment(review.comment);
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const reviews = data?.data ?? [];

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand bg-white px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-deep text-brand">
          <StarIcon size={26} />
        </div>
        <p className="text-lg font-semibold text-gray-900">You haven't reviewed anything yet</p>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-gray-500">
          Reviews you write on a product page show up here, where you can change the rating, rewrite
          the comment or delete it.
        </p>
        <Link
          to={ROUTES.PRODUCTS}
          onClick={onBrowseProducts}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Find something to review
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notice && (
        <div
          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
            notice.tone === "ok"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {reviews.map((review) => {
        const isEditing = editing?._id === review._id;

        return (
          <article
            key={review._id}
            className="rounded-2xl border border-sand bg-white p-5 shadow-[0_2px_16px_rgba(61,5,12,0.06)] transition-all duration-300 hover:border-brand/30 sm:p-6"
          >
            <div className="flex gap-4 sm:gap-5">
              <ProductImage review={review} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    {review.product ? (
                      <Link
                        to={ROUTES.PRODUCT_DETAIL(review.product._id)}
                        className="block truncate text-base font-bold text-gray-900 transition-colors hover:text-brand"
                      >
                        {review.product.name}
                      </Link>
                    ) : (
                      <span className="block truncate text-base font-bold text-gray-400">
                        Product no longer listed
                      </span>
                    )}

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <StarRating value={review.rating} size={16} />
                      <span className="text-sm font-semibold text-gray-700">{review.rating}.0</span>
                      {review.product && (
                        <span className="text-sm font-bold text-brand">
                          {formatCurrency(review.product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(review)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sand px-3 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                      >
                        <PencilIcon size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNotice(null);
                          setConfirmDelete(review);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/10"
                      >
                        <TrashIcon size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-4 rounded-xl border border-brand/25 bg-cream/60 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/60">
                      Your rating
                    </p>
                    <div className="mt-2">
                      <StarPicker value={draftRating} onChange={setDraftRating} size={26} />
                    </div>

                    <label
                      htmlFor={`comment-${review._id}`}
                      className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-ink/60"
                    >
                      Your comment
                    </label>
                    <textarea
                      id={`comment-${review._id}`}
                      value={draftComment}
                      onChange={(event) => setDraftComment(event.target.value)}
                      rows={4}
                      maxLength={COMMENT_MAX}
                      placeholder="What did you like or dislike?"
                      className="mt-2 w-full resize-none rounded-xl border border-[#ded2c4] bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                    />
                    <p className="mt-1 text-right text-[11px] text-ink/50">
                      {draftComment.length}/{COMMENT_MAX}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={updateMutation.isPending || draftRating < 1 || draftRating > 5}
                        onClick={() =>
                          updateMutation.mutate({
                            id: review._id,
                            rating: draftRating,
                            comment: draftComment,
                            productId: review.product?._id ?? null,
                          })
                        }
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                      >
                        {updateMutation.isPending ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-lg border border-sand px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-cream"
                      >
                        Cancel
                      </button>
                      {draftRating < 1 && (
                        <span className="text-xs font-semibold text-red-600">
                          Pick a star rating first.
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    {review.comment ? (
                      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                        {review.comment}
                      </p>
                    ) : (
                      <p className="text-sm italic text-gray-400">You left a rating without a comment.</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
                      <span>{formatRelativeTime(review.created_at)}</span>
                      {review.verified_purchase && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 font-bold text-green-700">
                          Verified purchase
                        </span>
                      )}
                      <span className="rounded-full bg-cream-deep px-2 py-0.5 font-semibold text-ink/70">
                        {review.product?.slug ? `#${review.product.slug}` : "Review"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {data?.pagination && (
        <div className="pt-4">
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}

      <Modal
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete this review?"
      >
        <p className="text-sm text-gray-600">
          Your rating and comment on{" "}
          <span className="font-semibold text-gray-900">
            {confirmDelete?.product?.name ?? "this product"}
          </span>{" "}
          will be removed permanently. You can write a new one afterwards.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(null)}
            className="rounded-lg border border-sand px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-cream"
          >
            Keep it
          </button>
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete review"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyReviews;
