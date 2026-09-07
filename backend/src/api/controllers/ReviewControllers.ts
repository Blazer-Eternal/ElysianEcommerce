import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { ReviewServices, ProductServices } from "../../services";
import { RoleEnum } from "../../enums/UserEnums";

export class ReviewController {
  static async getProductReviews(req: CustomRequestInterface, res: Response) {
    const productId = req.params.productId as string;
    try {
      const reviews = await new ReviewServices().findByProduct(productId);
      return res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async createReview(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const { product_id, rating, comment } = req.body;

    try {
      const product = await new ProductServices().findById(product_id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const existingReview = await new ReviewServices().findByUserAndProduct(userId, product_id);
      if (existingReview) {
        return res.status(400).json({ success: false, message: "You have already reviewed this product" });
      }

      const verified_purchase = await new ReviewServices().hasVerifiedPurchase(userId, product_id);

      const review = await new ReviewServices().create({
        user_id: userId as any,
        product_id,
        rating,
        comment,
        verified_purchase,
      });

      return res.status(201).json({ success: true, message: "Review created successfully", data: review });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateReview(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const userId = req.user?.id as string;
    const reviewData = req.body;

    try {
      const review = await new ReviewServices().findById(id);
      if (!review) return res.status(404).json({ success: false, message: "Review not found" });

      if (review.user_id.toString() !== userId) {
        return res.status(403).json({ success: false, message: "You can only edit your own review" });
      }

      const updatedReview = await new ReviewServices().update(id, reviewData);

      return res.status(200).json({ success: true, message: "Review updated successfully", data: updatedReview });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async deleteReview(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const userId = req.user?.id as string;

    try {
      const review = await new ReviewServices().findById(id);
      if (!review) return res.status(404).json({ success: false, message: "Review not found" });

      if (review.user_id.toString() !== userId && req.user?.role !== RoleEnum.admin) {
        return res.status(403).json({ success: false, message: "You can only delete your own review" });
      }

      await new ReviewServices().delete(id);

      return res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}