import { useState } from "react";
import { HeartFilledIcon, HeartIcon } from "../icons";
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
      // Silently ignore, e.g. duplicate-add race condition
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubmitting}
      className={`inline-flex items-center justify-center leading-none transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
        active ? "text-brand" : "text-gray-700 hover:text-brand"
      } ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      {active ? <HeartFilledIcon size={18} /> : <HeartIcon size={18} />}
    </button>
  );
};

export default WishlistButton;
