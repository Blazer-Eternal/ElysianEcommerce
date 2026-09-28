import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../models/ProductModel";

dotenv.config();

/**
 * One-off backfill for products that were seeded before the storefront gained
 * MRP/discount support:
 *   - mrp  → 15% above the selling price (rounded), only when missing or below price.
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

      if (typeof product.mrp !== "number" || product.mrp < product.price) {
        set.mrp = Math.round(product.price * 1.15);
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
