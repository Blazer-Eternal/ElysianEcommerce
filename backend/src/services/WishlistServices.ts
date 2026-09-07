import { WishlistModel } from "../models/WishlistModel";
import { WishlistInterface, InputWishlistInterface } from "../intefaces/WishlistInterface";

export class WishlistServices {
  public async findByUser(userId: string): Promise<WishlistInterface[]> {
    return await WishlistModel.find({ user_id: userId })
      .populate("product_id", "name price images stock status rating_avg")
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