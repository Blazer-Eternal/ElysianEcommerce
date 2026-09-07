import { ProductModel } from "../models/ProductModel";
import { ProductInterface, InputProductInterface } from "../intefaces/ProductInterface";

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
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
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (category_id) {
      filter.category_id = category_id;
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