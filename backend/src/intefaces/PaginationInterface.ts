export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}