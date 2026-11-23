export type AccountType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'income'
  | 'expense';

export type JournalVoucherType =
  | 'general'
  | 'opening'
  | 'closing'
  | 'adjustment'
  | 'sales'
  | 'purchase'
  | 'receipt'
  | 'payment';

export type JournalEntryStatus =
  | 'draft'
  | 'posted'
  | 'cancelled';

export interface ChartOfAccount {
  uuid: string;
  account_code: string;
  account_name: string;
  account_type: AccountType;
  opening_balance: number;
  current_balance: number;
  is_system: boolean;
  is_active: boolean;
  account_group_uuid?: string;
  account_group_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JournalEntryLine {
  uuid?: string;
  account_uuid?: string;
  account_name?: string;
  account_code?: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  uuid: string;
  voucher_no: string;
  voucher_type?: JournalVoucherType;
  transaction_date: string;
  transaction_date_formatted?: string;
  posting_date?: string;
  posting_date_formatted?: string;
  currency_code?: string;
  description?: string | null;
  status: JournalEntryStatus;
  lines?: JournalEntryLine[];
  created_at?: string;
  updated_at?: string;
}

export type PaymentType = 'receive' | 'pay';
export type PaymentPartyType = 'customer' | 'supplier' | 'other';
export type PaymentStatus = 'draft' | 'confirmed' | 'cancelled' | 'reversed';

export interface PaymentRecord {
  uuid: string;
  payment_no: string;
  payment_type: PaymentType;
  payment_date: string;
  payment_date_formatted?: string;
  party_type?: PaymentPartyType;
  party_uuid?: string;
  amount: number;
  payment_method?: string;
  reference_no?: string | null;
  notes?: string | null;
  status: PaymentStatus;
  created_at?: string;
  updated_at?: string;
}

export interface TrialBalanceReport {
  accounts: Array<{
    account_code: string;
    account_name: string;
    account_type: string;
    debit: number;
    credit: number;
  }>;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
}

export interface ProfitLossReport {
  income_accounts: Array<{
    account_code: string;
    account_name: string;
    amount: number;
  }>;
  expense_accounts: Array<{
    account_code: string;
    account_name: string;
    amount: number;
  }>;
  total_income: number;
  total_expense: number;
  net_profit: number;
}

export interface BalanceSheetReport {
  assets: Array<{
    account_code: string;
    account_name: string;
    amount: number;
  }>;
  liabilities: Array<{
    account_code: string;
    account_name: string;
    amount: number;
  }>;
  equities: Array<{
    account_code: string;
    account_name: string;
    amount: number;
  }>;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  total_liabilities_and_equity: number;
  is_balanced: boolean;
}

export interface AccountingQueryParams {
  page?: number;
  per_page?: number;
  account_type?: string;
  status?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
}
