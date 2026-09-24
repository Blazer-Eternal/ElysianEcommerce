import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { cartService } from "../services/cartService";
import type { Cart } from "../types/cart.types";
import { useAuth } from "../hooks/useAuth";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
}

interface CartActions {
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const CartStateContext = createContext<CartState | undefined>(undefined);
export const CartActionsContext = createContext<CartActions | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(
    async (signal?: AbortSignal) => {
      if (!isAuthenticated) {
        setCart(null);
        return;
      }
      setIsLoading(true);
      try {
        const response = await cartService.get({ signal });
        if (signal?.aborted) return;
        setCart(response.data);
      } catch {
        if (signal?.aborted) return;
        setCart(null);
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCart(controller.signal);
    return () => controller.abort();
  }, [fetchCart]);

  const addItem = useCallback(async (productId: string, quantity: number) => {
    const response = await cartService.addItem({ product_id: productId, quantity });
    setCart(response.data);
  }, []);

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    const response = await cartService.updateItem(productId, { quantity });
    setCart(response.data);
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const response = await cartService.removeItem(productId);
    setCart(response.data);
  }, []);

  const clearCart = useCallback(async () => {
    const response = await cartService.clear();
    setCart(response.data);
  }, []);

  const refetch = useCallback(() => fetchCart(), [fetchCart]);

  const itemCount = useMemo(() => cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0, [cart]);

  const stateValue = useMemo(() => ({ cart, isLoading, itemCount }), [cart, isLoading, itemCount]);
  const actionsValue = useMemo(
    () => ({ addItem, updateItem, removeItem, clearCart, refetch }),
    [addItem, updateItem, removeItem, clearCart, refetch]
  );

  return (
    <CartActionsContext.Provider value={actionsValue}>
      <CartStateContext.Provider value={stateValue}>{children}</CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
};
