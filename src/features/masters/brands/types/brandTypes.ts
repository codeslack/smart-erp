// src/features/masters/brands/types/brandTypes.ts

export interface Brand {
  uuid: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  products_count?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface BrandFilters {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: string;
}
