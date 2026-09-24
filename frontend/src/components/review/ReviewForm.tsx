import { useState, type FormEvent, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface ReviewFormProps {
  productId: string;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const starContainerRef = useRef<HTMLDivElement>(null);

  const handleStarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!starContainerRef.current) return;
    
    const rect = starContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const isLeftHalf = (x % starWidth) < starWidth / 2;
    
    const newRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setHoveredRating(Math.max(0.5, Math.min(5, newRating)));
  };

  const handleStarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!starContainerRef.current) return;
    
    const rect = starContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const isLeftHalf = (x % starWidth) < starWidth / 2;
    
    const newRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setRating(Math.max(0.5, Math.min(5, newRating)));
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = (value: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          let fillPercentage = 0;
          
          if (value >= starIndex) {
            fillPercentage = 100;
          } else if (value > starIndex - 1) {
            fillPercentage = (value - (starIndex - 1)) * 100;
          }
          
          return (
            <div key={starIndex} className="relative w-6 h-6">
              {/* Empty star background */}
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              
              {/* Filled star overlay */}
              {fillPercentage > 0 && (
                <div 
                  className="absolute top-0 left-0 h-6 overflow-hidden transition-[width] duration-75"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await reviewService.create({ product_id: productId, rating, comment: comment || undefined });
      setSuccess(true);
      setComment("");
      setRating(0);
      setHoveredRating(0);
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
    <form onSubmit={handleSubmit} className="w-full">
      <style>{`
        @keyframes float-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes star-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        .review-form-container {
          animation: float-in 0.6s ease-out;
        }
        .star-hovered {
          animation: star-bounce 0.3s ease-out;
        }
      `}</style>
      
      <div className="review-form-container space-y-4 p-6 bg-linear-to-br from-white via-purple-50/30 to-blue-50/30 rounded-2xl border-2 border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300">
        
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
          {/* Rating is a custom star widget (no form field), so it's a span - a <label> without an
              associated form element is an accessibility violation */}
          <span className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Rating</span>
          <div className="flex items-center gap-3">
            <div
              ref={starContainerRef}
              onMouseMove={handleStarHover}
              onClick={handleStarClick}
              onMouseLeave={handleStarLeave}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              {renderStars(hoveredRating || rating)}
            </div>
            <div className="flex items-center gap-1">
              {rating === 0 ? (
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  Click to rate
                </span>
              ) : (
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                  {rating.toFixed(1)}/5
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">Hover and click to select half or full stars</p>
        </div>

        {/* Comment Section */}
        <div>
          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Tell us about your experience... (optional)"
            className="w-full p-3 border-2 border-purple-200/60 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300/50 transition-all duration-300 resize-none text-sm"
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs text-gray-500">Character count:</span>
            <span className={`text-xs font-semibold ${comment.length > 900 ? 'text-orange-600' : 'text-gray-600'}`}>
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
              ? 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)'
              : 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)',
          }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
