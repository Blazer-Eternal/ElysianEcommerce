import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { ProductStatusEnum } from "../../enums/ProductEnums";
import { ProductServices, CategoryServices } from "../../services";

export class ProductController {
  // Public: list products with pagination, search, and filters
  static async getAllProducts(req: CustomRequestInterface, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const search = req.query.search as string | undefined;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const category_id = req.query.category_id as string | undefined;
      const status = req.query.status as string | undefined;
      const inStock = req.query.inStock === "true";
      const sortBy = (req.query.sortBy as string) || "created_at";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";

      const result = await new ProductServices().findAll({
        page,
        limit,
        search,
        minPrice,
        maxPrice,
        category_id,
        status,
        inStock,
        sortBy,
        sortOrder,
      });

      return res.status(200).json({ success: true, data: result.products, pagination: result.pagination });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
   
     // Admin: upload product images, returns array of accessible URLs
  static async uploadImages(req: CustomRequestInterface, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: "No images uploaded" });
      }

      const imageUrls = files.map((file) => `/uploads/products/${file.filename}`);

      return res.status(200).json({ success: true, message: "Images uploaded successfully", data: { images: imageUrls } });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getProductById(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const product = await new ProductServices().findById(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getProductsByCategory(req: CustomRequestInterface, res: Response) {
    const categoryId = req.params.categoryId as string;
    try {
      const products = await new ProductServices().findByCategory(categoryId);
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async createProduct(req: CustomRequestInterface, res: Response) {
    const productData = req.body;
    try {
      const existingSlug = await new ProductServices().findBySlug(productData.slug);
      if (existingSlug) {
        return res.status(400).json({ success: false, message: `Product with slug '${productData.slug}' already exists` });
      }

      const existingSku = await new ProductServices().findBySku(productData.sku);
      if (existingSku) {
        return res.status(400).json({ success: false, message: `Product with SKU '${productData.sku}' already exists` });
      }

      const categoryExists = await new CategoryServices().findById(productData.category_id);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      const product = await new ProductServices().create({
        ...productData,
        status: productData.status || ProductStatusEnum.draft,
      });

      return res.status(201).json({ success: true, message: "Product created successfully", data: product });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateProduct(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const productData = req.body;
    try {
      const product = await new ProductServices().findById(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      if (productData.category_id) {
        const categoryExists = await new CategoryServices().findById(productData.category_id);
        if (!categoryExists) {
          return res.status(404).json({ success: false, message: "Category not found" });
        }
      }

      const updatedProduct = await new ProductServices().update(id, productData);

      return res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateStock(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const { stock } = req.body;
    try {
      const product = await new ProductServices().findById(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      const updatedProduct = await new ProductServices().updateStock(id, stock);

      return res.status(200).json({ success: true, message: "Stock updated successfully", data: updatedProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async deleteProduct(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const product = await new ProductServices().findById(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      await new ProductServices().delete(id);

      return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}