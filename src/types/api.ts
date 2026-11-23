/**
 * Standard API Response envelope adhering directly to Laravel backend's ApiResponse trait.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationLinkItem {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLinkItem[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ApiPaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | null;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

export interface PaginatedQueryParams extends QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
