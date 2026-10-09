import mongoose from "mongoose";
import dotenv from "dotenv";
import { CouponModel } from "../models/CouponModel";
import { DiscountTypeEnum } from "../enums/CouponEnums";

dotenv.config();

interface CouponSeed {
  code: string;
  discount_type: DiscountTypeEnum;
  value: number;
  min_order_amount: number;
  /** ISO date (YYYY-MM-DD) the coupon stops working. */
  expiry_date: string;
  /** null = unlimited redemptions. */
  usage_limit: number | null;
  max_discount?: number | null;
  per_user_limit?: number | null;
  per_user_window_days?: number;
  category_scope?: string[];
  electronics_only?: boolean;
  exclude_electronics?: boolean;
  min_tier?: string | null;
  purpose: string;
}

/** All coupons expire end of 2026 as specified in the promotion plan. */
const EXPIRY = "2026-12-31";

const couponData: CouponSeed[] = [
  // Always-on
  {
    code: "WELCOME10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 1000,
    expiry_date: EXPIRY,
    usage_limit: null,
    max_discount: 1000,
    per_user_limit: 1,
    per_user_window_days: 365,
    purpose: "New customers, first order only",
  },
  {
    code: "FREESHIP",
    discount_type: DiscountTypeEnum.fixed,
    value: 150,
    min_order_amount: 2000,
    expiry_date: EXPIRY,
    usage_limit: null,
    per_user_limit: 3,
    per_user_window_days: 30,
    purpose: "Waives the standard delivery fee",
  },
  {
    code: "SAVE500",
    discount_type: DiscountTypeEnum.fixed,
    value: 500,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 1000,
    per_user_limit: 1,
    per_user_window_days: 30,
    exclude_electronics: true,
    purpose: "Mid-size basket reward",
  },
  // Lifecycle
  {
    code: "COMEBACK300",
    discount_type: DiscountTypeEnum.fixed,
    value: 300,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: null,
    per_user_limit: 1,
    per_user_window_days: 30,
    purpose: "Abandoned-cart recovery",
  },
  {
    code: "MISSYOU",
    discount_type: DiscountTypeEnum.fixed,
    value: 400,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: null,
    per_user_limit: 1,
    per_user_window_days: 90,
    purpose: "Inactive 60+ days win-back",
  },
  // Tier-gated. Every tier code carries the same shape: a Rs. 3,000 minimum,
  // a capped percentage, electronics excluded (percentages never touch them)
  // and two redemptions per member per 30 days.
  {
    code: "GOLD10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: null,
    max_discount: 1500,
    per_user_limit: 2,
    per_user_window_days: 30,
    exclude_electronics: true,
    min_tier: "gold",
    purpose: "Gold tier coupon",
  },
  {
    code: "PLAT12",
    discount_type: DiscountTypeEnum.percentage,
    value: 12,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: null,
    max_discount: 2500,
    per_user_limit: 2,
    per_user_window_days: 30,
    exclude_electronics: true,
    min_tier: "platinum",
    purpose: "Platinum tier coupon",
  },
  {
    code: "DIAMOND15",
    discount_type: DiscountTypeEnum.percentage,
    value: 15,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: null,
    max_discount: 4000,
    per_user_limit: 2,
    per_user_window_days: 30,
    exclude_electronics: true,
    min_tier: "diamond",
    purpose: "Diamond tier coupon",
  },
  // Campaign
  {
    code: "FESTIVE15",
    discount_type: DiscountTypeEnum.percentage,
    value: 15,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 1000,
    max_discount: 2000,
    per_user_limit: 1,
    per_user_window_days: 30,
    purpose: "Festival / seasonal sale",
  },
  // Flash codes are released to members first. The code itself is never
  // printed on a public page, Platinum and Diamond receive it in their
  // account and email ahead of any public window, which keeps the 150-run cap
  // away from coupon sites and bots.
  {
    code: "FLASH25",
    discount_type: DiscountTypeEnum.percentage,
    value: 25,
    min_order_amount: 8000,
    expiry_date: EXPIRY,
    usage_limit: 150,
    max_discount: 3000,
    per_user_limit: 1,
    per_user_window_days: 365,
    min_tier: "platinum",
    category_scope: ["fashion", "beauty", "jewellery", "toys", "home decor"],
    purpose: "Weekend flash sale, released to Platinum and Diamond first",
  },
  {
    code: "CLEAR30",
    discount_type: DiscountTypeEnum.percentage,
    value: 30,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 100,
    max_discount: 3000,
    per_user_limit: 1,
    per_user_window_days: 365,
    category_scope: ["fashion", "footwear", "bags"],
    purpose: "Clearance-tagged stock",
  },
  {
    code: "LAUNCH10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: 300,
    max_discount: 1000,
    purpose: "New-arrival launch",
  },
  {
    code: "FREEGIFT",
    discount_type: DiscountTypeEnum.fixed,
    value: 500,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 200,
    purpose: "Free gift bundle (valued at cost)",
  },
  // Partner
  {
    code: "CREATOR10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 2000,
    expiry_date: EXPIRY,
    usage_limit: 500,
    max_discount: 1000,
    purpose: "Influencer / affiliate, one code per creator",
  },
  {
    code: "BULK10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 20000,
    expiry_date: EXPIRY,
    usage_limit: 100,
    max_discount: 5000,
    purpose: "Bulk / wholesale",
  },
  // Electronics (fixed amount only; percentages never touch electronics)
  {
    code: "TECH2K",
    discount_type: DiscountTypeEnum.fixed,
    value: 2000,
    min_order_amount: 50000,
    expiry_date: EXPIRY,
    usage_limit: 200,
    electronics_only: true,
    purpose: "Electronics boost",
  },
  {
    code: "BIGBUY5K",
    discount_type: DiscountTypeEnum.fixed,
    value: 5000,
    min_order_amount: 150000,
    expiry_date: EXPIRY,
    usage_limit: 100,
    electronics_only: true,
    purpose: "High-value electronics orders",
  },
];

const seedCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    let created = 0;
    let updated = 0;
    let unchanged = 0;

    // Codes that no longer exist in the promotion plan are deactivated rather
    // than deleted, so historical orders keep a valid coupon reference.
    const activeCodes = couponData.map((c) => c.code);
    const deactivated = await CouponModel.updateMany(
      { code: { $nin: activeCodes }, is_active: true },
      { $set: { is_active: false } }
    );
    if (deactivated.modifiedCount > 0) {
      console.log(`Deactivated ${deactivated.modifiedCount} retired coupon code(s).`);
    }

    for (const seed of couponData) {
      const expiry = new Date(`${seed.expiry_date}T23:59:59.999Z`);
      const existing = await CouponModel.findOne({ code: seed.code });

      if (!existing) {
        await CouponModel.create({
          code: seed.code,
          discount_type: seed.discount_type,
          value: seed.value,
          min_order_amount: seed.min_order_amount,
          expiry_date: expiry,
          usage_limit: seed.usage_limit,
          max_discount: seed.max_discount ?? null,
          per_user_limit: seed.per_user_limit ?? null,
          per_user_window_days: seed.per_user_window_days ?? 30,
          category_scope: seed.category_scope ?? [],
          electronics_only: seed.electronics_only ?? false,
          exclude_electronics: seed.exclude_electronics ?? false,
          min_tier: seed.min_tier ?? null,
          used_count: 0,
          is_active: true,
        });
        created += 1;
        console.log(`Created: ${seed.code}, ${seed.purpose}`);
        continue;
      }

      // Re-running the seeder refreshes the promotion config but never erases
      // real redemption history (used_count) or manually disabled coupons.
      const changed =
        existing.discount_type !== seed.discount_type ||
        existing.value !== seed.value ||
        existing.min_order_amount !== seed.min_order_amount ||
        existing.usage_limit !== seed.usage_limit ||
        existing.max_discount !== (seed.max_discount ?? null) ||
        existing.per_user_limit !== (seed.per_user_limit ?? null) ||
        existing.electronics_only !== (seed.electronics_only ?? false) ||
        existing.exclude_electronics !== (seed.exclude_electronics ?? false) ||
        existing.min_tier !== (seed.min_tier ?? null) ||
        existing.expiry_date.getTime() !== expiry.getTime();

      if (!changed) {
        unchanged += 1;
        continue;
      }

      await CouponModel.updateOne(
        { _id: existing._id },
        {
          $set: {
            discount_type: seed.discount_type,
            value: seed.value,
            min_order_amount: seed.min_order_amount,
            expiry_date: expiry,
            usage_limit: seed.usage_limit,
            max_discount: seed.max_discount ?? null,
            per_user_limit: seed.per_user_limit ?? null,
            per_user_window_days: seed.per_user_window_days ?? 30,
            category_scope: seed.category_scope ?? [],
            electronics_only: seed.electronics_only ?? false,
            exclude_electronics: seed.exclude_electronics ?? false,
            min_tier: seed.min_tier ?? null,
          },
        }
      );
      updated += 1;
      console.log(`Updated: ${seed.code}, ${seed.purpose}`);
    }

    console.log(
      `Coupon seeding complete. Created: ${created}, Updated: ${updated}, Already up to date: ${unchanged}.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
};

seedCoupons();
