import { WishlistModel } from "../models/WishlistModel";
import { WishlistInterface, InputWishlistInterface } from "../intefaces/WishlistInterface";

export class WishlistServices {
  public async findByUser(userId: string): Promise<WishlistInterface[]> {
    // Category + MRP included so the wishlist can group items and show real
    // discounts; status/stock so out-of-stock items are known without a refetch.
    return await WishlistModel.find({ user_id: userId })
      .populate(
        "product_id",
        "name price mrp cost_price images stock status category_id rating_avg rating_count description"
      )
      .sort({ created_at: 1 });
  }

  public async findOne(userId: string, productId: string): Promise<WishlistInterface | null> {
    return await WishlistModel.findOne({ user_id: userId, product_id: productId });
  }

  public async create(data: InputWishlistInterface): Promise<WishlistInterface> {
    return await WishlistModel.create(data);
  }

  public async remove(userId: string, productId: string): Promise<WishlistInterface | null> {
    return await WishlistModel.findOneAndDelete({ user_id: userId, product_id: productId });
  }
}