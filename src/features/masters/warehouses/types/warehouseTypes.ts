export interface Warehouse {
  id: number;
  uuid: string;
  tenant_id: number;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedWarehouses {
  data: Warehouse[];
  meta: LaravelPaginationMeta;
}
