import { formatCurrency } from "../utils/formatCurrency";

export interface PriceRange {
  /** Inclusive lower bound in NPR. */
  min: number;
  /** Inclusive upper bound. Omitted on the open-ended top bucket. */
  max?: number;
}

/**
 * Storefront price buckets, sized against the catalogue's real price spread
 * (Rs. 300 – Rs. 214,000, with ~2/3 of products under Rs. 10,000): fine steps
 * where products actually cluster, wider steps for the premium tail.
 */
export const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 5_000 },
  { min: 5_000, max: 10_000 },
  { min: 10_000, max: 50_000 },
  { min: 50_000, max: 100_000 },
  { min: 100_000, max: 150_000 },
  { min: 150_000, max: 200_000 },
  { min: 200_000 },
];

/**
 * Stable per-range key, used for React list keys and as the segment inside
 * the encoded `priceRanges` query value (e.g. "0-5000,200000-").
 */
export const priceRangeKey = (range: PriceRange): string => `${range.min}-${range.max ?? ""}`;

/** Human label, e.g. "Rs. 0 - Rs. 5,000" or "Rs. 2,00,000 and above". */
export const priceRangeLabel = (range: PriceRange): string =>
  range.max === undefined
    ? `${formatCurrency(range.min)} and above`
    : `${formatCurrency(range.min)} - ${formatCurrency(range.max)}`;

/** Splits an encoded `priceRanges` query value back into its selected keys. */
export const parsePriceRanges = (encoded?: string): Set<string> =>
  new Set((encoded ?? "").split(",").filter(Boolean));
