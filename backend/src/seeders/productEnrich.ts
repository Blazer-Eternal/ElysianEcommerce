import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../models/ProductModel";
import { discountPercentBetween, discountPercentFor, mrpForPrice } from "./pricing";
import { PRODUCT_CONTENT } from "./productContent";

dotenv.config();

/**
 * One-off backfill for products that were seeded before the storefront gained
 * MRP/discount support and full product copy:
 *   - mrp  → recomputed from the tiered discount ladder (13-16% off premium
 *     items, 5-7% off everyday ones) when it is missing, sits below the selling
 *     price, or still carries the old flat 15% markup the seeder used to write.
 *   - description → replaced with the long-form FAQ copy when the stored one is
 *     still the original one-liner (anything under 400 characters).
 *   - key_benefits / how_to_use → filled from the copy library when empty.
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

      const content = PRODUCT_CONTENT[product.slug];
      if (content) {
        const description = (product.description || "").trim();
        if (description.length < 400) set.description = content.description;
        if (!Array.isArray(product.key_benefits) || product.key_benefits.length === 0) {
          set.key_benefits = content.key_benefits;
        }
        if (!Array.isArray(product.how_to_use) || product.how_to_use.length === 0) {
          set.how_to_use = content.how_to_use;
        }
      } else {
        if (!Array.isArray(product.key_benefits)) set.key_benefits = [];
        if (!Array.isArray(product.how_to_use)) set.how_to_use = [];
      }

      if (Object.keys(set).length > 0) {
        await ProductModel.updateOne({ _id: product._id }, { $set: set });
        updated++;
        const notes = [
          set.mrp !== undefined ? `mrp ${set.mrp}` : null,
          set.description !== undefined ? "description" : null,
          set.key_benefits !== undefined ? "benefits" : null,
          set.how_to_use !== undefined ? "how-to-use" : null,
        ]
          .filter(Boolean)
          .join(", ");
        console.log(`Updated: ${product.name} → ${notes}`);
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
