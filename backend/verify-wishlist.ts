import mongoose from "mongoose";
import "dotenv/config";
import { WishlistModel } from "./src/models/WishlistModel";
import { ProductModel } from "./src/models/ProductModel";
import { ReviewModel } from "./src/models/ReviewModel";

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);

  console.log("== Wishlist populated exactly like WishlistServices.findByUser ==");
  const items = await WishlistModel.find({}).populate(
    "product_id",
    "name price images stock status rating_avg rating_count"
  );

  for (const item of items) {
    const p = item.product_id as any;
    if (!p || typeof p !== "object") {
      console.log("  UNPOPULATED product_id:", String(item.product_id));
      continue;
    }
    console.log(
      `  ${p.name} | rating_avg=${JSON.stringify(p.rating_avg)} rating_count=${JSON.stringify(
        p.rating_count
      )}`
    );
  }

  console.log("\n== Raw product docs ==");
  const products = await ProductModel.find({}).select("name rating_avg rating_count").lean();
  products.forEach((p) =>
    console.log(`  ${p.name} | avg=${p.rating_avg} count=${p.rating_count}`)
  );

  console.log("\n== Actual reviews grouped by product ==");
  const grouped = await ReviewModel.aggregate([
    { $group: { _id: "$product_id", count: { $sum: 1 }, avg: { $avg: "$rating" } } },
  ]);
  if (grouped.length === 0) console.log("  (no reviews at all)");
  grouped.forEach((g) => console.log(`  product=${g._id} count=${g.count} avg=${g.avg}`));

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
