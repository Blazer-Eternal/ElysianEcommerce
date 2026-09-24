import { Schema, model } from "mongoose";
import { ProductInterface } from "../intefaces/ProductInterface";
import { ProductStatusEnum } from "../enums/ProductEnums";

const ProductSchema = new Schema<ProductInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    // min/max price range filtering and sortBy=price in ProductServices.findAll().
    index: true,
  },
  cost_price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    // findByCategory() and category-only filters query equality on this field.
    index: true,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (arr: string[]) => arr.length >= 1,
      message: "At least one image is required",
    },
  },
  status: {
    type: String,
    enum: Object.values(ProductStatusEnum),
    default: ProductStatusEnum.draft,
  },
  rating_avg: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  rating_count: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
    // sortBy=created_at on unfiltered listings (admin ManageProducts/DataTablesDemo
    // call findAll() with no status filter, so the compound indexes below can't
    // serve their sort).
    index: true,
  },
});

/*
 * Query-performance indexes for ProductServices.findAll() hot paths:
 *
 * 1. { status: 1, created_at: -1 }
 *    The storefront default: { status: "active" } sorted by created_at
 *    (ProductList, ProductsSection). Also serves status=active equality
 *    filtering as an index prefix, so no standalone { status } index is needed.
 *
 * 2. { status: 1, category_id: 1, created_at: -1 }
 *    Category-filtered storefront listing: equality on both status and
 *    category_id with the sort satisfied directly by the index (no in-memory
 *    SORT stage).
 */
ProductSchema.index({ status: 1, created_at: -1 });
ProductSchema.index({ status: 1, category_id: 1, created_at: -1 });

export const ProductModel = model<ProductInterface>("Product", ProductSchema);