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
  },
});

export const ProductModel = model<ProductInterface>("Product", ProductSchema);