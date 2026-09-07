import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { WishlistServices, ProductServices } from "../../services";

export class WishlistController {
  // Logged-in user: get own wishlist
  static async getMyWishlist(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    try {
      const wishlist = await new WishlistServices().findByUser(userId);
      return res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Logged-in user: add a product to wishlist
  static async addToWishlist(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const { product_id } = req.body;

    try {
      const product = await new ProductServices().findById(product_id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const existing = await new WishlistServices().findOne(userId, product_id);
      if (existing) {
        return res.status(400).json({ success: false, message: "Product is already in your wishlist" });
      }

      const wishlistItem = await new WishlistServices().create({
        user_id: userId as any,
        product_id,
      });

      return res.status(201).json({ success: true, message: "Added to wishlist", data: wishlistItem });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Logged-in user: remove a product from wishlist
  static async removeFromWishlist(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const productId = req.params.productId as string;

    try {
      const removed = await new WishlistServices().remove(userId, productId);
      if (!removed) {
        return res.status(404).json({ success: false, message: "Product not found in your wishlist" });
      }

      return res.status(200).json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}