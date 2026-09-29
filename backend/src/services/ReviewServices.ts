import { ReviewModel } from "../models/ReviewModel";
import { ProductModel } from "../models/ProductModel";
import { OrderModel } from "../models/OrderModel";
import { OrderStatusEnum } from "../enums/OrderEnums";
import { ReviewInterface, InputReviewInterface } from "../intefaces/ReviewInterface";

export type ReviewSort = "recent" | "oldest" | "rating_desc" | "rating_asc";

export interface ReviewQueryOptions {
  page?: number;
  limit?: number;
  sort?: ReviewSort;
  rating?: number;
}

export interface ReviewStats {
  average: number;
  count: number;
  distribution: { star: number; count: number; percentage: number }[];
}

const REVIEW_SORTS: Record<ReviewSort, Record<string, 1 | -1>> = {
  recent: { created_at: -1 },
  oldest: { created_at: 1 },
  rating_desc: { rating: -1, created_at: -1 },
  rating_asc: { rating: 1, created_at: -1 },
};

export class ReviewServices {
  /**
   * Returns one page of reviews for a product (newest-first by default),
   * plus the pagination metadata needed to render page controls.
   */
  public async findByProduct(productId: string, options: ReviewQueryOptions = {}) {
    const { page = 1, limit = 5, sort = "recent", rating } = options;

    const filter: Record<string, unknown> = { product_id: productId };
    if (rating) filter.rating = rating;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter)
        .populate("user_id", "name")
        .sort(REVIEW_SORTS[sort] ?? REVIEW_SORTS.recent)
        .skip(skip)
        .limit(limit),
      ReviewModel.countDocuments(filter),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Aggregate for the rating summary block: overall average, total count and
   * the per-star breakdown (5 → 1) used to draw the progress bars.
   * Always computed over every review, regardless of the list filter.
   */
  public async getStats(productId: string): Promise<ReviewStats> {
    const reviews = await ReviewModel.find({ product_id: productId }).select("rating").lean();
    const count = reviews.length;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);

    return {
      average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
      count,
      distribution: [5, 4, 3, 2, 1].map((star) => {
        const starCount = reviews.filter((review) => Math.round(review.rating) === star).length;
        return {
          star,
          count: starCount,
          percentage: count > 0 ? Math.round((starCount / count) * 100) : 0,
        };
      }),
    };
  }

  /**
   * Returns all reviews across all products (admin moderation view),
   * with user and product data populated, plus pagination metadata.
   */
  public async findAll(options: ReviewQueryOptions = {}) {
    const { page = 1, limit = 10, sort = "recent" } = options;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ReviewModel.find()
        .populate("user_id", "name")
        .populate("product_id", "name")
        .sort(REVIEW_SORTS[sort] ?? REVIEW_SORTS.recent)
        .skip(skip)
        .limit(limit),
      ReviewModel.countDocuments(),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  public async findById(id: string): Promise<ReviewInterface | null> {
    return await ReviewModel.findById(id);
  }

  public async findByUserAndProduct(userId: string, productId: string): Promise<ReviewInterface | null> {
    return await ReviewModel.findOne({ user_id: userId, product_id: productId }).populate("user_id", "name");
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
    const updated = await ReviewModel.findByIdAndUpdate(id, reviewData, {
      returnDocument: "after",
      runValidators: true,
    });
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