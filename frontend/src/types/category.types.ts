export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent_id: { _id: string; name: string; slug: string } | string | null;
  description?: string;
  created_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parent_id?: string | null;
  description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;