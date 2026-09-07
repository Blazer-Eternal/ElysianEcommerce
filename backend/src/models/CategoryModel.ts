import { Schema, model } from "mongoose";
import { CategoryInterface } from "../intefaces/CategoryInterface";

const CategorySchema = new Schema<CategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  description: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const CategoryModel = model<CategoryInterface>("Category", CategorySchema);