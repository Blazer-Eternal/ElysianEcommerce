export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  cost_price?: number;
  stock: number;
  category_id: { _id: string; name: string; slug: string } | string;
  images: string[];
  status: ProductStatus;
  rating_avg: number;
  rating_count: number;
  created_at: string;
}

export interface ProductQueryParams {
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

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  cost_price?: number;
  stock: number;
  category_id: string;
  images: string[];
  status?: ProductStatus;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;