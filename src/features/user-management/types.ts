export interface LaravelPaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface LaravelPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
  links: LaravelPaginationLinks[];
}

export interface LaravelPagination<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: LaravelPaginationMeta; // Nested metadata payload containing totals
}

export interface User {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}
