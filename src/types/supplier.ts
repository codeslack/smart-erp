export type CreditControlType = 'none' | 'warn' | 'block';
export type OpeningBalanceType = 'debit' | 'credit';

export interface SupplierOpeningBill {
  uuid?: string;
  bill_no: string;
  bill_date: string;
  due_date?: string | null;
  amount: number;
  balance_amount: number;
  balance_type: OpeningBalanceType;
  notes?: string | null;
  delete?: boolean;
}

export interface Supplier {
  uuid: string;
  code: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  tax_number: string | null;
  payment_term_uuid?: string | null;
  credit_days: number | null;
  credit_limit: number | null;
  credit_control: CreditControlType;
  is_active: boolean;
  opening_bills?: SupplierOpeningBill[];
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierRequest {
  name: string;
  code?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  tax_number?: string | null;
  payment_term_id?: number | null;
  credit_days?: number | null;
  credit_limit?: number | null;
  credit_control?: CreditControlType;
  is_active?: boolean;
  opening_bills?: SupplierOpeningBill[];
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export interface SupplierQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}
