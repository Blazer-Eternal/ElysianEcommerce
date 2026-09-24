import { useContext } from "react";
import { CartStateContext, CartActionsContext } from "../context/CartContext";

/**
 * Full cart access (state + actions). Prefer `useCartState` or
 * `useCartActions` in components that only need one side, so cart
 * mutations don't re-render subscribers that only display state (and
 * vice versa).
 */
export const useCart = () => {
  const state = useCartState();
  const actions = useCartActions();
  return { ...state, ...actions };
};

/** Cart state only — re-renders when cart/items change. */
export const useCartState = () => {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error("useCartState must be used within a CartProvider");
  }
  return context;
};

/** Cart actions only — stable identity, no re-renders on cart changes. */
export const useCartActions = () => {
  const context = useContext(CartActionsContext);
  if (context === undefined) {
    throw new Error("useCartActions must be used within a CartProvider");
  }
  return context;
};
