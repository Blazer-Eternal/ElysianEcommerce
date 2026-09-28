import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import StarPicker from "../ui/StarPicker";
import type { Review } from "../../types/review.types";

interface ReviewFormProps {
  productId: string;
  /** Set when the signed-in user has already reviewed — the form is replaced by a hint. */
  myReview?: Review | null;
  /** Called right after a brand-new review is published (so the list can jump to it). */
  onCreated?: () => void;
}

/**
 * Create-only review form. Editing/deleting always happens through the ⋯ menu on
 * the user's own review card, so there is only ever one place that writes a review.
 */
const ReviewForm = ({ productId, myReview = null, onCreated }: ReviewFormProps) => {
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewService.create({ product_id: productId, rating, comment: comment.trim() || undefined });
      setSuccess(true);
      setComment("");
      setRating(0);
      onCreated?.();
      invalidate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Already reviewed: no second form. The card's ⋯ menu is the edit path.
  if (myReview) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50/70 border border-purple-200/70 text-sm text-gray-700">
        <span className="text-lg leading-none" aria-hidden="true">✅</span>
        <p>
          You already reviewed this product. Use the{" "}
          <span className="font-bold text-purple-700">⋯</span> menu on your review below to edit
          your rating or comment, or to delete it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <style>{`
        @keyframes float-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .review-form-container {
          animation: float-in 0.6s ease-out;
        }
      `}</style>

      <div className="review-form-container space-y-4 p-6 bg-linear-to-br from-white via-purple-50/50 to-blue-50/30 rounded-2xl border-2 border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ✨ Share Your Experience
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">Help others decide</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2">
            <span>❌</span>
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium flex items-center gap-2">
            <span>🎉</span>
            Thank you! Your review submitted successfully!
          </div>
        )}

        {/* Rating Section */}
        <div>
          <span className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Rating
          </span>
          <div className="flex items-center gap-3">
            <StarPicker value={rating} onChange={setRating} size={26} disabled={isSubmitting} />
            <div className="flex items-center gap-1">
              {rating === 0 ? (
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  Click to rate
                </span>
              ) : (
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                  {rating}/5
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Hover and click to select a full star rating (1–5)
          </p>
        </div>

        {/* Comment Section */}
        <div>
          <label
            htmlFor="review-comment"
            className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide"
          >
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Tell us about your experience... (optional)"
            className="w-full p-3 border-2 border-purple-200/60 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300/50 transition-all duration-300 resize-none text-sm"
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs text-gray-500">Character count:</span>
            <span className={`text-xs font-semibold ${comment.length > 900 ? "text-orange-600" : "text-gray-600"}`}>
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 font-bold text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
          style={{
            background: isSubmitting
              ? "linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)"
              : "linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)",
          }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Publish Review</span>
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
