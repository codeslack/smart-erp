// src/features/accounting/types.ts

export interface AccountGroup {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface ChartOfAccount {
  id: number;
  tenant_id: number;
  account_group_id: number;
  parent_id: number | null;
  account_code: string;
  account_name: string;
  account_type: "asset" | "liability" | "equity" | "income" | "expense";
  opening_balance: string;
  current_balance: string;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  group: AccountGroup;
  parent: any | null;
}

export interface JournalLine {
  id: number;
  chart_of_account_id: number;
  account_name: string;
  debit: string;
  credit: string;
  description: string | null;
}

export interface JournalEntry {
  id: number;
  voucher_no: string;
  voucher_type:
    "journal" | "purchase" | "supplier_payment" | "sale" | "customer_receipt";
  entry_date: string;
  description: string;
  status: "draft" | "posted";
  reference_type: string | null;
  reference_id: number | null;
  lines: JournalLine[]; // Eagerly loaded lines matrix
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: LaravelPaginationMeta;
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: LaravelPaginationMeta;
}
