import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.getByProduct(productId),
  });

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await reviewService.remove(reviewId);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (isLoading) return <p className="text-sm text-gray-500">Loading reviews...</p>;

  const reviews = data?.data || [];

  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const reviewer = typeof review.user_id === "object" ? review.user_id : null;
        const isOwner = reviewer?._id === user?.id || review.user_id === user?.id;

        return (
          <div key={review._id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{reviewer?.name || "User"}</span>
                {review.verified_purchase && (
                  <span className="ml-2 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
            </div>

            <div className="text-sm mt-1">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>

            {review.comment && <p className="text-sm text-gray-700 mt-1">{review.comment}</p>}

            {isOwner && (
              <button
                onClick={() => handleDelete(review._id)}
                className="text-xs text-red-600 mt-1 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
