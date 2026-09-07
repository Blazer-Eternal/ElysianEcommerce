export interface Review {
  _id: string;
  user_id: { _id: string; name: string } | string;
  product_id: string;
  rating: number;
  comment?: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}