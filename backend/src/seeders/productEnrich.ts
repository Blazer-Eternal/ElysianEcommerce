import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../models/ProductModel";
import { discountPercentBetween, discountPercentFor, mrpForPrice } from "./pricing";

dotenv.config();

/**
 * One-off backfill for products that were seeded before the storefront gained
 * MRP/discount support:
 *   - mrp  → recomputed from the tiered discount ladder (13-16% off premium
 *     items, 5-7% off everyday ones) when it is missing, sits below the selling
 *     price, or still carries the old flat 15% markup the seeder used to write.
 *   - key_benefits / how_to_use → initialised to [] so the API always returns arrays.
 *
 * Run with: npm run enrich:products
 */
const enrichProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const products = await ProductModel.find();
    let updated = 0;

    for (const product of products) {
      const set: Record<string, unknown> = {};

      const price = product.price;
      const mrp = product.mrp;
      const hasUsableMrp = typeof mrp === "number" && mrp > price;
      // Signature of the old seeder: a flat 15% above the selling price.
      const isLegacyFlatMrp = hasUsableMrp && mrp === Math.round(price * 1.15);
      // Discount no longer matches what this price tier should advertise.
      const isWrongTier =
        hasUsableMrp &&
        discountPercentBetween(price, mrp) !== discountPercentFor(price);

      if (!hasUsableMrp || isLegacyFlatMrp || isWrongTier) {
        set.mrp = mrpForPrice(price);
      }
      if (!Array.isArray(product.key_benefits)) set.key_benefits = [];
      if (!Array.isArray(product.how_to_use)) set.how_to_use = [];

      if (Object.keys(set).length > 0) {
        await ProductModel.updateOne({ _id: product._id }, { $set: set });
        updated++;
        console.log(`Updated: ${product.name} → mrp ${set.mrp ?? product.mrp}`);
      }
    }

    console.log(`\nProduct enrichment complete. Updated: ${updated} of ${products.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Error enriching products:", error);
    process.exit(1);
  }
};

enrichProducts();
