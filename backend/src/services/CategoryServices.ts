import { CategoryModel } from "../models/CategoryModel";
import { CategoryInterface, InputCategoryInterface } from "../intefaces/CategoryInterface";

export class CategoryServices {
  public async findAll(): Promise<CategoryInterface[]> {
    return await CategoryModel.find().populate("parent_id", "name slug");
  }

  public async findById(id: string): Promise<CategoryInterface | null> {
    return await CategoryModel.findById(id).populate("parent_id", "name slug");
  }

  public async findBySlug(slug: string): Promise<CategoryInterface | null> {
    return await CategoryModel.findOne({ slug });
  }

  public async findByName(name: string): Promise<CategoryInterface | null> {
    return await CategoryModel.findOne({ name });
  }

  // Direct children of a given category (for building nested trees)
  public async findChildren(parentId: string): Promise<CategoryInterface[]> {
    return await CategoryModel.find({ parent_id: parentId });
  }

  public async create(categoryData: InputCategoryInterface): Promise<CategoryInterface> {
    return await CategoryModel.create(categoryData);
  }

  public async update(id: string, categoryData: Partial<InputCategoryInterface>): Promise<CategoryInterface | null> {
    return await CategoryModel.findByIdAndUpdate(id, categoryData, { returnDocument: "after" });
  }

  public async delete(id: string): Promise<CategoryInterface | null> {
    return await CategoryModel.findByIdAndDelete(id);
  }
}