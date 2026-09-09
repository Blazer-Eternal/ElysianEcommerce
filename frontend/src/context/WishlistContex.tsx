import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { wishlistService } from "../services/wishlistService";
import type { WishlistItem } from "../types/wishlist.types";
import { useAuth } from "../hooks/useAuth";

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await wishlistService.getAll();
      setItems(response.data);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => {
      const pid = typeof item.product_id === "object" ? item.product_id._id : item.product_id;
      return pid === productId;
    });
  };

  // Optimistically mark as "in wishlist" immediately for instant heart-icon feedback,
  // then refetch the full populated list from the server so Wishlist.tsx has
  // complete product data to render (the raw POST response isn't populated).
  const addToWishlist = async (productId: string) => {
    await wishlistService.add({ product_id: productId });
    await fetchWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    await wishlistService.remove(productId);
    setItems((prev) =>
      prev.filter((item) => {
        const pid = typeof item.product_id === "object" ? item.product_id._id : item.product_id;
        return pid !== productId;
      })
    );
  };

  return (
    <WishlistContext.Provider
      value={{ items, isLoading, isInWishlist, addToWishlist, removeFromWishlist, refetch: fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
