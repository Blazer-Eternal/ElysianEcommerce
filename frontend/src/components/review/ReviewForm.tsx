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
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-6">
      <h3 className="font-medium mb-3">Write a Review</h3>

      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 px-3 py-2 rounded">{error}</div>}
      {success && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
          Review submitted successfully!
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;