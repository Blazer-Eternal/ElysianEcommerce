import { CartModel } from "../models/CartModel";
import { CartInterface, CartItemInterface } from "../intefaces/CartInterface";

export class CartServices {
  public async findByUserId(userId: string): Promise<CartInterface | null> {
    return await CartModel.findOne({ user_id: userId }).populate("items.product_id", "name price images stock status");
  }

  // Raw cart, without populate — items.product_id stays a plain ObjectId.
  // Used internally (e.g. order creation) where the actual ID is needed, not expanded product data.
  public async findRawByUserId(userId: string): Promise<CartInterface | null> {
    return await CartModel.findOne({ user_id: userId });
  }

  public async createEmptyCart(userId: string): Promise<CartInterface> {
    return await CartModel.create({ user_id: userId, items: [] });
  }

  public async addItem(userId: string, productId: string, quantity: number): Promise<CartInterface | null> {
    const cart = await CartModel.findOne({ user_id: userId });

    if (!cart) {
      return await CartModel.create({
        user_id: userId,
        items: [{ product_id: productId, quantity }],
      });
    }

    const existingItem = cart.items.find((item) => item.product_id.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product_id: productId as any, quantity });
    }

    cart.updated_at = new Date();
    await cart.save();
    return await CartModel.findOne({ user_id: userId }).populate("items.product_id", "name price images stock status");
  }

  public async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartInterface | null> {
    return await CartModel.findOneAndUpdate(
      { user_id: userId, "items.product_id": productId },
      { $set: { "items.$.quantity": quantity, updated_at: new Date() } },
      { returnDocument: "after" }
    ).populate("items.product_id", "name price images stock status");
  }

  public async removeItem(userId: string, productId: string): Promise<CartInterface | null> {
    return await CartModel.findOneAndUpdate(
      { user_id: userId },
      { $pull: { items: { product_id: productId } }, $set: { updated_at: new Date() } },
      { returnDocument: "after" }
    ).populate("items.product_id", "name price images stock status");
  }

  public async clearCart(userId: string): Promise<CartInterface | null> {
    return await CartModel.findOneAndUpdate(
      { user_id: userId },
      { $set: { items: [], updated_at: new Date() } },
      { returnDocument: "after" }
    );
  }
}