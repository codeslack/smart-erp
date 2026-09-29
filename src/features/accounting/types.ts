// src/features/accounting/types.ts

// ==========================================
// 1. CORE GENERAL LEDGER MODELS & METRICS
// ==========================================
export interface AccountGroup {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
}

export interface ChartOfAccount {
  id: number;
  account_group_id: number | null; // FIXED: Added missing foreign key property matching Laravel columns
  account_code: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  current_balance: string;
  group: AccountGroup;
  parent_id: number | null;
  is_system?: boolean;
  is_active?: boolean;
}


export interface JournalLine {
  id: number;
  chart_of_account_id: number;
  account_name: string;
  debit: string;
  credit: string;
}

export interface JournalEntry {
  id: number;
  voucher_no: string;
  voucher_type: string;
  entry_date: string;
  description: string;
  status: 'draft' | 'posted';
  lines: JournalLine[];
}

// ==========================================
// 2. FINANCIAL STATEMENTS REPORT STRUCTURES
// ==========================================
export interface BalanceSheetItem {
  account_code: string;
  account_name: string;
  balance: number;
}

export interface BalanceSheetData {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equities: BalanceSheetItem[];
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  total_liabilities_and_equity: number;
  is_balanced: boolean;
}

export interface BalanceSheetResponse {
  success: boolean;
  message: string;
  data: BalanceSheetData;
}

export interface ProfitLossAccountItem {
  account_code: string;
  account_name: string;
  amount: number;
}

export interface ProfitLossData {
  income_accounts: ProfitLossAccountItem[];
  expense_accounts: ProfitLossAccountItem[];
  total_income: number;
  total_expense: number;
  net_profit: number;
}

export interface ProfitLossResponse {
  success: boolean;
  message: string;
  data: ProfitLossData;
}

export interface TrialBalanceAccountItem {
  account_code: string;
  account_name: string;
  account_type: string;
  debit: number;
  credit: number;
}

export interface TrialBalanceData {
  accounts: TrialBalanceAccountItem[];
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
}

export interface TrialBalanceResponse {
  success: boolean;
  message: string;
  data: TrialBalanceData;
}

// ==========================================
// 3. CORE LARAVEL PAGINATION LAYOUT ENVELOPES
// ==========================================
export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: LaravelPaginationMeta;
}
