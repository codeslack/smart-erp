// Inside src/features/accounting/journals/types/journalTypes.ts

export interface JournalLineItem {
  id?: number;
  chart_of_account_id: number;
  account_name?: string;
  account_code: string;
  debit: string;
  credit: string;
  description?: string | null;
}

export interface JournalVoucher {
  id: number;
  voucher_no: string;
  voucher_type:
    "journal" | "purchase" | "supplier_payment" | "sale" | "customer_receipt";
  entry_date: string;
  description?: string | null;
  status: "draft" | "posted" | "cancelled";
  reference_type: string | null;
  reference_id: number | null;
  lines: JournalLineItem[];
}

export interface LaravelMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedJournals {
  data: JournalVoucher[];
  meta: LaravelMeta;
}
