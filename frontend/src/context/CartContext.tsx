import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { cartService } from "../services/cartService";
import type { Cart } from "../types/cart.types";
import { useAuth } from "../hooks/useAuth";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await cartService.get();
      setCart(response.data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: string, quantity: number) => {
    const response = await cartService.addItem({ product_id: productId, quantity });
    setCart(response.data);
  };

  const updateItem = async (productId: string, quantity: number) => {
    const response = await cartService.updateItem(productId, { quantity });
    setCart(response.data);
  };

  const removeItem = async (productId: string) => {
    const response = await cartService.removeItem(productId);
    setCart(response.data);
  };

  const clearCart = async () => {
    const response = await cartService.clear();
    setCart(response.data);
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, isLoading, itemCount, addItem, updateItem, removeItem, clearCart, refetch: fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};