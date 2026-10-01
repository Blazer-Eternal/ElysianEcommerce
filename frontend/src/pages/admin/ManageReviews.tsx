import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Review } from "../../types/review.types";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#f59e0b" : "#e5e7eb"}
          stroke={star <= rating ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ManageReviews = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews", page],
    queryFn: ({ signal }) => reviewService.getAll({ page, limit: 10, sort: "recent", signal }),
    refetchInterval: 5000,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    try {
      await reviewService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const reviews = data?.data || [];

  const getCustomerName = (review: Review): string => {
    if (typeof review.user_id === "object" && review.user_id !== null) {
      return review.user_id.name;
    }
    return "—";
  };

  const getProductName = (review: Review): string => {
    if (typeof review.product_id === "object" && review.product_id !== null) {
      return (review.product_id as unknown as { name: string }).name;
    }
    return "—";
  };

  return (
    <AdminLayout>
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">Admin Panel</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage Reviews</h1>
            <p className="text-gray-600 mt-2">View and moderate all customer reviews across your store.</p>
          </div>

          {/* Reviews Table */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 glass rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-lg">No reviews found.</p>
            </div>
          ) : (
            <>
              <div className="glass rounded-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header */}
                    <thead>
                      <tr className="border-b border-gray-200 bg-linear-to-r from-brand/5 to-cyan-600/5">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Customer Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Comments</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-white/20">
                      {reviews.map((review) => (
                        <tr key={review._id} className="hover:bg-linear-to-r hover:from-brand/5 hover:to-cyan-600/5 transition-colors">
                          {/* Product Name */}
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">
                              {getProductName(review)}
                            </span>
                          </td>

                          {/* Customer Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {getCustomerName(review).charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {getCustomerName(review)}
                              </span>
                            </div>
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <StarRating rating={review.rating} />
                              <span className="text-xs text-gray-500 font-medium">{review.rating}/5</span>
                            </div>
                          </td>

                          {/* Comments */}
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {review.comment || <span className="italic text-gray-400">No comment</span>}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{formatDate(review.created_at)}</span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-200 font-semibold text-xs whitespace-nowrap"
                              title="Delete Review"
                            >
                              <DeleteIcon />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {data?.pagination && (
                <div className="mt-8">
                  <Pagination pagination={data.pagination} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageReviews;
