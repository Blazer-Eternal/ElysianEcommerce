import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface ReviewFormProps {
  productId: string;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await reviewService.create({ product_id: productId, rating, comment: comment || undefined });
      setSuccess(true);
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="group relative">
      {/* Animated Background Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-blue-400/5 to-indigo-400/5 rounded-2xl blur-xl group-hover:from-purple-400/10 group-hover:via-blue-400/10 group-hover:to-indigo-400/10 transition-all duration-500"></div>

      <div className="relative bg-gradient-to-br from-white/80 via-purple-50/30 to-blue-50/30 backdrop-blur-xl rounded-2xl border border-purple-200/40 shadow-xl hover:shadow-2xl transition-all duration-500 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Share Your Experience
          </h3>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-red-700 text-sm font-medium flex items-start gap-3 animate-slide-down">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 text-green-700 text-sm font-medium flex items-start gap-3 animate-slide-down">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>✓ Thank you! Your review has been submitted successfully!</span>
          </div>
        )}

        {/* Rating Stars */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">Your Rating</label>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="relative group/star"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur opacity-0 group-hover/star:opacity-75 transition-opacity duration-300 -inset-1"></div>
                  <svg
                    className={`relative w-8 h-8 transition-all duration-200 transform ${
                      star <= (hoveredStar ?? rating)
                        ? "fill-yellow-400 scale-110"
                        : "fill-gray-300 scale-100"
                    } hover:scale-125 cursor-pointer`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <span className="ml-3 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
              {hoveredStar ?? rating} of 5
            </span>
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">Your Comment</label>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Tell us about your experience with this product... (optional)"
              className="w-full px-4 py-3 rounded-xl border border-purple-200/50 bg-white/50 backdrop-blur text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
            />
            <span className="absolute bottom-3 right-3 text-xs font-medium text-gray-500">
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative w-full group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl blur opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -inset-0.5"></div>
          <div className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover/btn:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                </svg>
                <span>Publish Review</span>
              </>
            )}
          </div>
        </button>

        {/* Character Count Info */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          Character count: {comment.length}/{1000}
        </p>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </form>
  );
};

export default ReviewForm;
