import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { CategoryServices } from "../../services";

export class CategoryController {
  static async getAllCategories(req: CustomRequestInterface, res: Response) {
    try {
      const categories = await new CategoryServices().findAll();
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getCategoryById(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const category = await new CategoryServices().findById(id);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });

      return res.status(200).json({ success: true, data: category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getChildren(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const children = await new CategoryServices().findChildren(id);
      return res.status(200).json({ success: true, data: children });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async createCategory(req: CustomRequestInterface, res: Response) {
    const { name, slug, parent_id, description } = req.body;
    try {
      const existingName = await new CategoryServices().findByName(name);
      if (existingName) {
        return res.status(400).json({ success: false, message: `Category with name '${name}' already exists` });
      }

      const existingSlug = await new CategoryServices().findBySlug(slug);
      if (existingSlug) {
        return res.status(400).json({ success: false, message: `Category with slug '${slug}' already exists` });
      }

      if (parent_id) {
        const parentExists = await new CategoryServices().findById(parent_id);
        if (!parentExists) {
          return res.status(404).json({ success: false, message: "Parent category not found" });
        }
      }

      const category = await new CategoryServices().create({
        name,
        slug,
        parent_id: parent_id || null,
        description,
      });

      return res.status(201).json({ success: true, message: "Category created successfully", data: category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateCategory(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const categoryData = req.body;
    try {
      const category = await new CategoryServices().findById(id);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });

      if (categoryData.parent_id === id) {
        return res.status(400).json({ success: false, message: "A category cannot be its own parent" });
      }

      const updatedCategory = await new CategoryServices().update(id, categoryData);

      return res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async deleteCategory(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const category = await new CategoryServices().findById(id);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });

      const children = await new CategoryServices().findChildren(id);
      if (children.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete a category that has subcategories. Reassign or delete them first.",
        });
      }

      await new CategoryServices().delete(id);

      return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}