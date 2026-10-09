import { ProductModel } from "../models/ProductModel";
import { ProductInterface, InputProductInterface } from "../intefaces/ProductInterface";
import { CategoryServices } from "./CategoryServices";

export interface PriceRangeFilter {
  /** Inclusive lower bound in NPR. */
  min?: number;
  /** Inclusive upper bound; omitted for the open-ended top bucket. */
  max?: number;
}

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Selected price buckets, union of inclusive [min, max] windows. */
  priceRanges?: PriceRangeFilter[];
  category_id?: string;
  status?: string;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class ProductServices {
  public async findAll(options: ProductQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      minPrice,
      maxPrice,
      priceRanges,
      category_id,
      status,
      inStock,
      sortBy = "created_at",
      sortOrder = "desc",
    } = options;

    const filter: Record<string, any> = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Price constraints: a plain min/max pair narrows directly, while the
    // checked price buckets form a union (OR of inclusive windows).
    const bucketClauses = (priceRanges ?? [])
      .map((bucket) => {
        const condition: Record<string, number> = {};
        if (bucket.min !== undefined) condition.$gte = bucket.min;
        if (bucket.max !== undefined) condition.$lte = bucket.max;
        return Object.keys(condition).length > 0 ? { price: condition } : null;
      })
      .filter((clause): clause is { price: Record<string, number> } => clause !== null);

    const hasMinMax = minPrice !== undefined || maxPrice !== undefined;
    if (bucketClauses.length > 0 && hasMinMax) {
      const minMax: Record<string, number> = {};
      if (minPrice !== undefined) minMax.$gte = minPrice;
      if (maxPrice !== undefined) minMax.$lte = maxPrice;
      filter.$and = [{ $or: bucketClauses }, { price: minMax }];
    } else if (bucketClauses.length > 0) {
      filter.$or = bucketClauses;
    } else if (hasMinMax) {
      const price: Record<string, number> = {};
      if (minPrice !== undefined) price.$gte = minPrice;
      if (maxPrice !== undefined) price.$lte = maxPrice;
      filter.price = price;
    }
    if (category_id) {
      // Products always sit on a leaf category, so picking a parent in the
      // storefront has to match the whole subtree, not just the parent id.
      const categoryIds = await new CategoryServices().findSelfAndDescendants(category_id);
      filter.category_id = categoryIds.length > 1 ? { $in: categoryIds } : category_id;
    }
    if (status) {
      filter.status = status;
    }
    if (inStock) {
      filter.stock = { $gt: 0 };
    }

    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [products, total] = await Promise.all([
      ProductModel.find(filter).populate("category_id", "name slug").sort(sort).skip(skip).limit(limit),
      ProductModel.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  public async findById(id: string): Promise<ProductInterface | null> {
    return await ProductModel.findById(id).populate("category_id", "name slug");
  }

  public async findBySlug(slug: string): Promise<ProductInterface | null> {
    return await ProductModel.findOne({ slug });
  }

  public async findBySku(sku: string): Promise<ProductInterface | null> {
    return await ProductModel.findOne({ sku });
  }

  public async findByCategory(categoryId: string): Promise<ProductInterface[]> {
    return await ProductModel.find({ category_id: categoryId }).populate("category_id", "name slug");
  }

  public async create(productData: InputProductInterface): Promise<ProductInterface> {
    return await ProductModel.create(productData);
  }

  public async update(id: string, productData: Partial<InputProductInterface>): Promise<ProductInterface | null> {
    return await ProductModel.findByIdAndUpdate(id, productData, { returnDocument: "after" });
  }

  public async delete(id: string): Promise<ProductInterface | null> {
    return await ProductModel.findByIdAndDelete(id);
  }

  public async updateStock(id: string, stock: number): Promise<ProductInterface | null> {
    return await ProductModel.findByIdAndUpdate(id, { stock }, { returnDocument: "after" });
  }
}