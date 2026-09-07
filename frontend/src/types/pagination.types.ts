export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationResult;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}