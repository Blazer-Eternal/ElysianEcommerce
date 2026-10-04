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
  purpose: string;
}

/** All coupons expire end of 2026 as specified in the promotion plan. */
const EXPIRY = "2026-12-31";

const couponData: CouponSeed[] = [
  {
    code: "WELCOME10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 0,
    expiry_date: EXPIRY,
    usage_limit: null,
    purpose: "First purchase / welcome coupon",
  },
  {
    code: "FREESHIP",
    discount_type: DiscountTypeEnum.fixed,
    value: 150,
    min_order_amount: 2000,
    expiry_date: EXPIRY,
    usage_limit: null,
    purpose: "Free shipping (covers standard delivery fee)",
  },
  {
    code: "COMEBACK500",
    discount_type: DiscountTypeEnum.fixed,
    value: 500,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: null,
    purpose: "Abandoned cart recovery",
  },
  {
    code: "FESTIVE20",
    discount_type: DiscountTypeEnum.percentage,
    value: 20,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 1000,
    purpose: "Festival / seasonal sale",
  },
  {
    code: "BIGBUY15",
    discount_type: DiscountTypeEnum.percentage,
    value: 15,
    min_order_amount: 100000,
    expiry_date: EXPIRY,
    usage_limit: 100,
    purpose: "High-value order discount",
  },
  {
    code: "TECH10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 50000,
    expiry_date: EXPIRY,
    usage_limit: 200,
    purpose: "Category-specific (Electronics) boost",
  },
  {
    code: "VIP20",
    discount_type: DiscountTypeEnum.percentage,
    value: 20,
    min_order_amount: 10000,
    expiry_date: EXPIRY,
    usage_limit: 50,
    purpose: "Loyalty / VIP customer retention",
  },
  {
    code: "SAVE500",
    discount_type: DiscountTypeEnum.fixed,
    value: 500,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: null,
    purpose: "Minimum spend threshold (AOV increase)",
  },
  {
    code: "NEW10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 3000,
    expiry_date: EXPIRY,
    usage_limit: 300,
    purpose: "New arrival / launch",
  },
  {
    code: "CLEAR30",
    discount_type: DiscountTypeEnum.percentage,
    value: 30,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 100,
    purpose: "Clearance / end of season",
  },
  {
    code: "CREATOR15",
    discount_type: DiscountTypeEnum.percentage,
    value: 15,
    min_order_amount: 2000,
    expiry_date: EXPIRY,
    usage_limit: 500,
    purpose: "Influencer / affiliate",
  },
  {
    code: "FLASH25",
    discount_type: DiscountTypeEnum.percentage,
    value: 25,
    min_order_amount: 8000,
    expiry_date: EXPIRY,
    usage_limit: 150,
    purpose: "Weekend / flash sale",
  },
  {
    code: "FREEGIFT",
    discount_type: DiscountTypeEnum.fixed,
    value: 500,
    min_order_amount: 5000,
    expiry_date: EXPIRY,
    usage_limit: 200,
    purpose: "Free gift / bundle",
  },
  {
    code: "BULK10",
    discount_type: DiscountTypeEnum.percentage,
    value: 10,
    min_order_amount: 20000,
    expiry_date: EXPIRY,
    usage_limit: 100,
    purpose: "Bulk / wholesale",
  },
  {
    code: "MISSYOU",
    discount_type: DiscountTypeEnum.fixed,
    value: 300,
    min_order_amount: 2000,
    expiry_date: EXPIRY,
    usage_limit: null,
    purpose: "Re-engagement / win-back",
  },
];

const seedCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    let created = 0;
    let updated = 0;
    let unchanged = 0;

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
          used_count: 0,
          is_active: true,
        });
        created += 1;
        console.log(`Created: ${seed.code} — ${seed.purpose}`);
        continue;
      }

      // Re-running the seeder refreshes the promotion config but never erases
      // real redemption history (used_count) or manually disabled coupons.
      const changed =
        existing.discount_type !== seed.discount_type ||
        existing.value !== seed.value ||
        existing.min_order_amount !== seed.min_order_amount ||
        existing.usage_limit !== seed.usage_limit ||
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
          },
        }
      );
      updated += 1;
      console.log(`Updated: ${seed.code} — ${seed.purpose}`);
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
