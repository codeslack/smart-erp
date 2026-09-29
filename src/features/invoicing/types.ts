// src/features/invoicing/types.ts

export interface Invoice {
  id: number;
  invoice_no: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'draft';
}

export interface InvoicingSummary {
  gross_receivables: number;
  collected_funds: number;
  overdue_arrears: number;
  draft_allocations: number;
}

export interface InvoicingDashboardPayload {
  summary: InvoicingSummary;
  invoices: {
    data: Invoice[];
    current_page: number;
    last_page: number;
    total: number;
  };
}
