import { Document, Types } from "mongoose";

export interface InputCategoryInterface {
  name: string;
  slug: string;
  parent_id: Types.ObjectId | null;
  description?: string;
}

export interface CategoryInterface extends InputCategoryInterface, Document {
  created_at: Date;
}