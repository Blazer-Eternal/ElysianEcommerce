import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { CartServices, ProductServices } from "../../services";

export class CartController {
  // Get logged-in user's own cart
  static async getMyCart(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    try {
      let cart = await new CartServices().findByUserId(userId);
      if (!cart) {
        cart = await new CartServices().createEmptyCart(userId);
      }

      return res.status(200).json({ success: true, data: cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Add a product to cart (or increment quantity if already present)
  static async addItem(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const { product_id, quantity } = req.body;

    try {
      const product = await new ProductServices().findById(product_id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} units in stock` });
      }

      const cart = await new CartServices().addItem(userId, product_id, quantity);

      return res.status(200).json({ success: true, message: "Item added to cart", data: cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Update quantity of an item already in the cart
  static async updateItem(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const productId = req.params.productId as string;
    const { quantity } = req.body;

    try {
      const product = await new ProductServices().findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} units in stock` });
      }

      const cart = await new CartServices().updateItemQuantity(userId, productId, quantity);
      if (!cart) {
        return res.status(404).json({ success: false, message: "Item not found in cart" });
      }

      return res.status(200).json({ success: true, message: "Cart item updated", data: cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Remove one item from cart
  static async removeItem(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const productId = req.params.productId as string;

    try {
      const cart = await new CartServices().removeItem(userId, productId);
      return res.status(200).json({ success: true, message: "Item removed from cart", data: cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Clear the entire cart
  static async clearCart(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;

    try {
      const cart = await new CartServices().clearCart(userId);
      return res.status(200).json({ success: true, message: "Cart cleared", data: cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}