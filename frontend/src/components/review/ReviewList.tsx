import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useState } from "react";

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.getByProduct(productId),
  });

  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId);
    try {
      await reviewService.remove(reviewId);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setDeleteId(null);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-spin blur-sm"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
      </div>
    );

  const reviews = data?.data || [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No reviews yet</p>
        <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts about this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => {
        const reviewer = typeof review.user_id === "object" ? review.user_id : null;
        const isOwner = reviewer?._id === user?.id || review.user_id === user?.id;

        return (
          <div
            key={review._id}
            className="group relative animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background Blur */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative bg-white/80 backdrop-blur rounded-xl border border-purple-200/30 p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300/50">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {reviewer?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{reviewer?.name || "User"}</span>
                      {review.verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2.5 py-1 rounded-full border border-green-200/60">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(review.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 transition-colors duration-200 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
                  {review.rating} Stars
                </span>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed text-sm mb-4 italic">
                  "{review.comment}"
                </p>
              )}

              {/* Delete Button */}
              {isOwner && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200/50">
                  {deleteId === review._id ? (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={deletingId === review._id}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors duration-200 disabled:opacity-50"
                      >
                        {deletingId === review._id ? "Deleting..." : "Confirm Delete"}
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(review._id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReviewList;
