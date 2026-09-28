/**
 * Prices are displayed in Nepali Rupees ("Rs.") across the whole storefront.
 * Grouping follows the South-Asian lakh/crore style (Rs. 1,23,456) so large
 * amounts read naturally for NPR.
 */
export const formatCurrency = (amount: number): string => {
  const value = Number.isFinite(amount) ? amount : 0;

  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}`;
};

/** Discount percentage between an MRP and the selling price, rounded (0 when no real discount). */
export const formatDiscount = (price: number, mrp?: number): number => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

interface MrpSource {
  price: number;
  /** Struck-through original price, when the admin set one. */
  mrp?: number;
  /** Internal cost price — only treated as MRP when it is above the selling price. */
  cost_price?: number;
}

/**
 * The struck-through price to show next to the selling price, or undefined when
 * the product has no genuine discount.
 */
export const getDisplayMrp = ({ price, mrp, cost_price }: MrpSource): number | undefined => {
  if (mrp && mrp > price) return mrp;
  if (cost_price && cost_price > price) return cost_price;
  return undefined;
};
