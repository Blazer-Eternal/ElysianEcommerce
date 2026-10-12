/**
 * The coupon catalog exactly as the storefront publishes it.
 *
 * These rows mirror `backend/src/seeders/couponSeeder.ts` the same way
 * `utils/loyalty.ts` mirrors the tier engine: one set of figures for the
 * public compare-benefits table and for the customer portal, so a shopper is
 * never quoted a code they cannot apply. Every rule is re-checked server-side
 * by `POST /coupons/apply`, the only coupon endpoint the customer role can
 * reach, so this file only decides what we show, never what applies.
 */

import { formatCurrency } from "./formatCurrency";
import { FREE_DELIVERY_FEE } from "./loyalty";

export interface PublishedCoupon {
  code: string;
  /** Headline offer, phrased the way the checkout applies it. */
  offer: string;
  /** Formatted minimum basket the code needs. */
  min: string;
  /** Usage limits printed next to the code. */
  limits: string;
  /**
   * Index of the lowest tier that may use it, on the loyalty payload's
   * `tier.index` scale: -1 Registered, 0 Bronze, 1 Gold, 2 Platinum,
   * 3 Diamond. `-1` means every registered account qualifies.
   */
  minTierIndex: number;
}

/** Published in this order, tier codes leading the always-on ones. */
export const PUBLISHED_COUPONS: PublishedCoupon[] = [
  {
    code: "WELCOME10",
    offer: "10% off, up to Rs. 1,000",
    min: formatCurrency(1_000),
    limits: "Registered customers, once per account",
    minTierIndex: -1,
  },
  {
    code: "GOLD10",
    offer: "10% off, up to Rs. 1,500",
    min: formatCurrency(3_000),
    limits: "Gold and above, 2 uses per account every 30 days, electronics excluded",
    minTierIndex: 1,
  },
  {
    code: "PLAT12",
    offer: "12% off, up to Rs. 2,500",
    min: formatCurrency(3_000),
    limits: "Platinum and above, 2 uses per account every 30 days, electronics excluded",
    minTierIndex: 2,
  },
  {
    code: "DIAMOND15",
    offer: "15% off, up to Rs. 4,000",
    min: formatCurrency(3_000),
    limits: "Diamond, 2 uses per account every 30 days, electronics excluded",
    minTierIndex: 3,
  },
  {
    code: "FREESHIP",
    offer: `Standard delivery fee (Rs. ${FREE_DELIVERY_FEE}) waived`,
    min: formatCurrency(2_000),
    limits: "Up to 3 uses per account every 30 days",
    minTierIndex: -1,
  },
  {
    code: "SAVE500",
    offer: "Rs. 500 off",
    min: formatCurrency(5_000),
    limits: "1 use per account every 30 days, 1,000 redemptions total, electronics excluded",
    minTierIndex: -1,
  },
  {
    code: "FESTIVE15",
    offer: "15% off, up to Rs. 2,000",
    min: formatCurrency(5_000),
    limits: "Festival dates only, 1 use per account every 30 days, 1,000 redemptions total",
    minTierIndex: -1,
  },
  {
    code: "CLEAR30",
    offer: "30% off, up to Rs. 3,000",
    min: formatCurrency(5_000),
    limits: "Clearance-tagged fashion, footwear and bags, once per account, 100 redemptions total",
    minTierIndex: -1,
  },
];

/**
 * The codes a given tier may actually apply at checkout: the level's own
 * perks first (highest down to the shopper's own), then the always-on ones.
 *
 * `tierIndex` is `LoyaltySummary.tier.index`, so -1 is a Registered account
 * with no level earned yet. Bronze carries no dedicated code, it simply keeps
 * the Registered set. The filter returns a fresh array, so the shared catalog
 * order stays intact for the compare-benefits table.
 */
export const couponsForTier = (tierIndex: number): PublishedCoupon[] =>
  PUBLISHED_COUPONS.filter((coupon) => coupon.minTierIndex <= tierIndex).sort(
    (a, b) => b.minTierIndex - a.minTierIndex
  );
