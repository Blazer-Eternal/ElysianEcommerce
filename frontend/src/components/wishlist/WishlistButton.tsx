import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import { ROUTES } from "../../constants/routes";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton = ({ productId, className = "" }: WishlistButtonProps) => {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const active = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    setIsSubmitting(true);
    try {
      if (active) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch {
      // Silently ignore — e.g. duplicate-add race condition
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubmitting}
      className={`text-xl leading-none disabled:opacity-50 ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      {active ? "❤️" : "🤍"}
    </button>
  );
};

export default WishlistButton;