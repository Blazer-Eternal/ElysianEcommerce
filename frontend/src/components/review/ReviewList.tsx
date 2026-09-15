import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.getByProduct(productId),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-linear-to-r from-gray-100 to-gray-50 rounded-2xl animate-pulse h-24"></div>
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

  const reviews = data?.data || [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-linear-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 rounded-3xl border-2 border-dashed border-purple-200/50 hover:border-purple-300 transition-all duration-300">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-purple-200 to-pink-200 mb-6 shadow-lg shadow-purple-200/50 animate-bounce" style={{ animationDuration: '2s' }}>
          <span className="text-4xl">💬</span>
        </div>
        <p className="text-gray-900 font-bold text-lg mb-2">No reviews yet</p>
        <p className="text-gray-600 text-sm leading-relaxed">Be the first to share your thoughts about this amazing product! Your feedback helps others make informed decisions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes slide-in-review {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        .review-card {
          animation: slide-in-review 0.5s ease-out forwards;
        }
        .review-expanded {
          animation: expand 0.3s ease-out;
        }
      `}</style>
      {reviews.map((review: any, index: number) => (
        <div
          key={review._id}
          className="review-card group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            onClick={() => setExpandedReview(expandedReview === review._id ? null : review._id)}
            className="relative p-6 bg-linear-to-br from-white via-blue-50/30 to-purple-50/20 border-2 border-purple-200/40 rounded-2xl hover:border-purple-300 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-300/20 overflow-hidden group"
          >
            {/* Gradient Background Orbs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-purple-300 to-pink-300 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-linear-to-tr from-indigo-300 to-blue-300 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg">
                      {(review.user_id?.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{review.user_id?.name || "Anonymous"}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-lg" : "text-lg opacity-30"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-semibold bg-linear-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                          {review.rating}.0/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.verified_purchase && (
                    <span className="text-xs font-bold px-3 py-1 bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full border border-emerald-300 shadow-lg shadow-emerald-200/50 flex items-center gap-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </span>
                  )}
                  <svg
                    className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${
                      expandedReview === review._id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Review Comment */}
              {review.comment && (
                <div className={`overflow-hidden transition-all duration-300 ${expandedReview === review._id ? "review-expanded" : "line-clamp-2"}`}>
                  <p className="text-sm leading-relaxed bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent italic">
                    "{review.comment}"
                  </p>
                </div>
              )}

              {/* Show More Indicator */}
              {review.comment && review.comment.length > 100 && expandedReview !== review._id && (
                <p className="text-xs text-purple-600 font-semibold mt-2 cursor-pointer hover:text-purple-700 transition-colors">
                  → Click to expand
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;