export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  error?: string;
}
