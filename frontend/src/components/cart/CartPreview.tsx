import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartActions, useCartState } from "../../hooks/useCart";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { ROUTES } from "../../constants/routes";
import { formatCurrency } from "../../utils/formatCurrency";
import { cloudinaryImg } from "../../utils/imageUrl";
import { BagIcon, TrashIcon } from "../icons";
import type { CartItem as CartItemType } from "../../types/cart.types";
import type { Product } from "../../types/product.types";

/** Rows shown before the list scrolls; the cart page is the full view. */
const PREVIEW_LIMIT = 4;

interface Row {
  key: string;
  product: Product;
  quantity: number;
}

const toRows = (items: CartItemType[]): Row[] =>
  items.flatMap((item) => {
    const product = typeof item.product_id === "object" ? (item.product_id as Product) : null;
    return product ? [{ key: item._id ?? product._id, product, quantity: item.quantity }] : [];
  });

/**
 * "Active cart preview" panel hanging off the header cart icon.
 *
 * Reads the live cart from `CartContext`, so the thumbnail, price and subtotal
 * are the customer's real basket rather than a mock, and the remove button
 * calls the same `DELETE /cart/items/:productId` the cart page uses, keeping
 * both screens in sync.
 */
const CartPreview = () => {
  const { cart } = useCartState();
  const { removeItem } = useCartActions();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const rows = toRows(cart?.items ?? []);
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  const itemCount = rows.reduce((sum, row) => sum + row.quantity, 0);

  // Close on outside click or Escape, the same contract as the bell menus.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleRemove = async (row: Row) => {
    setRemovingKey(row.key);
    try {
      await removeItem(row.product._id);
    } finally {
      setRemovingKey(null);
    }
  };

  const handleCheckout = () => {
    setOpen(false);
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Cart with ${itemCount} items`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative rounded-xl p-2 text-ink/55 transition-colors hover:bg-brand/5 hover:text-brand"
      >
        <BagIcon size={20} />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1 min-w-4 rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Active cart preview"
          className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_12px_40px_rgba(61,5,12,0.16)] animate-fade-in"
        >
          <div className="flex items-baseline justify-between border-b border-sand px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
              Active Cart Preview
            </span>
            <span className="text-xs font-semibold text-ink/55">
              {itemCount} Item{itemCount === 1 ? "" : "s"}
            </span>
          </div>

          {rows.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-semibold text-ink">Your cart is empty</p>
              <p className="mt-1 text-xs text-ink/60">Add something you love and it will show up here.</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(ROUTES.PRODUCTS);
                }}
                className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Browse products
              </button>
            </div>
          ) : (
            <>
              <ul className="max-h-[46vh] space-y-2 overflow-y-auto px-3 py-3">
                {rows.slice(0, PREVIEW_LIMIT).map((row) => (
                  <li
                    key={row.key}
                    className="flex items-center gap-3 rounded-xl bg-cream/70 px-3 py-2.5 transition-colors hover:bg-cream"
                  >
                    <Link
                      to={ROUTES.PRODUCT_DETAIL(row.product._id)}
                      onClick={() => setOpen(false)}
                      className="shrink-0 overflow-hidden rounded-lg border border-sand bg-white"
                    >
                      <img
                        src={cloudinaryImg(row.product.images?.[0] ?? "", 128)}
                        alt={row.product.name}
                        width={44}
                        height={44}
                        loading="lazy"
                        decoding="async"
                        className="h-11 w-11 object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={ROUTES.PRODUCT_DETAIL(row.product._id)}
                        onClick={() => setOpen(false)}
                        className="block truncate text-sm font-bold text-ink transition-colors hover:text-brand"
                      >
                        {row.product.name}
                      </Link>
                      <p className="mt-0.5 text-sm font-bold text-brand">
                        {formatCurrency(row.product.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleRemove(row)}
                      disabled={removingKey === row.key}
                      aria-label={`Remove ${row.product.name} from cart`}
                      className="shrink-0 rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </li>
                ))}

                {rows.length > PREVIEW_LIMIT && (
                  <li className="px-1 pt-0.5 text-center text-xs font-semibold text-ink/55">
                    +{rows.length - PREVIEW_LIMIT} more in your cart
                  </li>
                )}
              </ul>

              <div className="border-t border-sand px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">Subtotal</span>
                  <span className="text-lg font-black text-ink">{formatCurrency(subtotal)}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-ink/55">Shipping and discounts apply at checkout.</p>
              </div>

              {!isAdmin && (
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_2px_16px_rgba(61,5,12,0.18)] transition-colors hover:bg-brand-dark"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPreview;
