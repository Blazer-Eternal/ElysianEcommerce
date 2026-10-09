/**
 * Maintenance script: rewrite seeded picsum.photos image URLs to the direct
 * (no-302) CDN URLs they redirect to, so the storefront stops paying an extra
 * round-trip per product image on first view. Idempotent, URLs that are
 * already direct are left untouched.
 *
 * Run from backend/:  npx tsx src/scripts/resolveProductImages.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "../models/ProductModel";

dotenv.config();

const resolveImageUrl = async (url: string): Promise<string> => {
  if (!url.startsWith("https://picsum.photos/")) return url;
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.url && res.url !== url ? res.url : url;
  } catch (error) {
    console.warn(`could not resolve ${url}: ${(error as Error).message}`);
    return url;
  }
};

const main = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI missing from backend/.env");
  await mongoose.connect(mongoUri);

  const products = await ProductModel.find({ images: /picsum\.photos/ });
  let updatedProducts = 0;
  let rewrittenUrls = 0;

  for (const product of products) {
    const before = product.images ?? [];
    const after = await Promise.all(before.map(resolveImageUrl));
    const changed = after.filter((url, i) => url !== before[i]);

    if (changed.length > 0) {
      product.images = after;
      await product.save();
      updatedProducts++;
      rewrittenUrls += changed.length;
      console.log(`updated: ${product.name} (${changed.length} image(s))`);
    }
  }

  console.log(
    `\nDone. Scanned: ${products.length}, products updated: ${updatedProducts}, URLs rewritten: ${rewrittenUrls}`
  );
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
