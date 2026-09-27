import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { ReviewServices, ProductServices } from "../../services";
import { RoleEnum } from "../../enums/UserEnums";
import { ReviewSort } from "../../services/ReviewServices";
import { ReviewInterface } from "../../intefaces/ReviewInterface";

const REVIEW_SORTS: ReviewSort[] = ["recent", "oldest", "rating_desc", "rating_asc"];

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** Mongoose/Zod failures are client mistakes, not server crashes. */
const sendValidationError = (res: Response, error: unknown): void => {
  const err = error as { name?: string; message?: string; errors?: Record<string, { message?: string }> };
  if (err?.name === "ValidationError") {
    const firstMessage = Object.values(err.errors || {})[0]?.message || err.message;
    res.status(400).json({ success: false, message: firstMessage || "Invalid review data" });
    return;
  }
  if (err?.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid id provided" });
    return;
  }
  res.status(500).json({ success: false, message: "Internal server error" });
};

export class ReviewController {
  static async getProductReviews(req: CustomRequestInterface, res: Response) {
    const productId = req.params.productId as string;
    const userId = req.user?.id as string;

    const page = toPositiveInt(req.query.page, 1);
    const limit = Math.min(50, toPositiveInt(req.query.limit, 5));
    const requestedSort = String(req.query.sort || "recent") as ReviewSort;
    const sort = REVIEW_SORTS.includes(requestedSort) ? requestedSort : "recent";
    const requestedRating = Number(req.query.rating);
    const rating = Number.isInteger(requestedRating) && requestedRating >= 1 && requestedRating <= 5
      ? requestedRating
      : undefined;

    try {
      const services = new ReviewServices();
      const [list, stats, foundReview] = await Promise.all([
        services.findByProduct(productId, { page, limit, sort, rating }),
        services.getStats(productId),
        userId ? services.findByUserAndProduct(userId, productId) : Promise.resolve(null),
      ]);

      // Never expose someone else's review as "mine" (guards against a token
      // without a user id ever matching an arbitrary document).
      let myReview: ReviewInterface | null = null;
      if (foundReview && userId) {
        const populated = foundReview.user_id as unknown as { _id?: unknown };
        const ownerId = populated && populated._id !== undefined ? String(populated._id) : String(foundReview.user_id);
        myReview = ownerId === userId ? foundReview : null;
      }

      return res.status(200).json({
        success: true,
        data: list.reviews,
        pagination: list.pagination,
        stats,
        myReview,
      });
    } catch (error) {
      return sendValidationError(res, error);
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
      return sendValidationError(res, error);
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
      return sendValidationError(res, error);
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
      return sendValidationError(res, error);
    }
  }
}