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

  /**
   * The category itself plus every descendant below it (breadth-first), so a
   * parent category can be used as a filter for the whole subtree. Categories
   * hold a flat parent_id pointer, so the tree is rebuilt from one small query.
   */
  public async findSelfAndDescendants(id: string): Promise<string[]> {
    const rows = await CategoryModel.find().select("_id parent_id").lean();
    const childrenByParent = new Map<string, string[]>();
    rows.forEach((row) => {
      if (!row.parent_id) return;
      const parentId = String(row.parent_id);
      childrenByParent.set(parentId, [...(childrenByParent.get(parentId) ?? []), String(row._id)]);
    });

    const ids: string[] = [];
    const seen = new Set<string>();
    const queue = [String(id)];
    while (queue.length > 0) {
      const current = queue.shift() as string;
      if (seen.has(current)) continue;
      seen.add(current);
      ids.push(current);
      queue.push(...(childrenByParent.get(current) ?? []));
    }
    return ids;
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