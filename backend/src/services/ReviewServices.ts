import { ReviewModel } from "../models/ReviewModel";
import { ProductModel } from "../models/ProductModel";
import { OrderModel } from "../models/OrderModel";
import { OrderStatusEnum } from "../enums/OrderEnums";
import { ReviewInterface, InputReviewInterface } from "../intefaces/ReviewInterface";

export class ReviewServices {
  public async findByProduct(productId: string): Promise<ReviewInterface[]> {
    return await ReviewModel.find({ product_id: productId })
      .populate("user_id", "name")
      .sort({ created_at: -1 });
  }

  public async findById(id: string): Promise<ReviewInterface | null> {
    return await ReviewModel.findById(id);
  }

  public async findByUserAndProduct(userId: string, productId: string): Promise<ReviewInterface | null> {
    return await ReviewModel.findOne({ user_id: userId, product_id: productId });
  }

  // Checks if this user has a delivered order containing this product
  public async hasVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
    const order = await OrderModel.findOne({
      user_id: userId,
      status: OrderStatusEnum.delivered,
      "items.product_id": productId,
    });
    return !!order;
  }

  public async create(reviewData: InputReviewInterface): Promise<ReviewInterface> {
    const review = await ReviewModel.create(reviewData);
    await this.recalculateProductRating(reviewData.product_id.toString());
    return review;
  }

  public async update(id: string, reviewData: Partial<InputReviewInterface>): Promise<ReviewInterface | null> {
    const updated = await ReviewModel.findByIdAndUpdate(id, reviewData, { returnDocument: "after" });
    if (updated) {
      await this.recalculateProductRating(updated.product_id.toString());
    }
    return updated;
  }

  public async delete(id: string): Promise<ReviewInterface | null> {
    const review = await ReviewModel.findByIdAndDelete(id);
    if (review) {
      await this.recalculateProductRating(review.product_id.toString());
    }
    return review;
  }

  private async recalculateProductRating(productId: string): Promise<void> {
    const reviews = await ReviewModel.find({ product_id: productId });
    const rating_count = reviews.length;
    const rating_avg =
      rating_count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / rating_count : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      rating_avg: Math.round(rating_avg * 10) / 10,
      rating_count,
    });
  }
}