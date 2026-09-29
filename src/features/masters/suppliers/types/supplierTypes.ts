export interface Supplier {
  id: number;
  tenant_id: number;
  name: string;
  code: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  tax_number: string | null;
  is_active: boolean;
  current_balance: string; // Balance tracked from database rows
  created_at: string;
}

export interface PaginatedSuppliers {
  data: Supplier[];
  meta: { current_page: number; last_page: number; total: number };
}
