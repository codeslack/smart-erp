export type CreditControlType = 'none' | 'warn' | 'block';
export type OpeningBalanceType = 'debit' | 'credit';

export interface CustomerOpeningBill {
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

export interface Customer {
  uuid: string;
  code: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  country_code: string | null;
  state_code: string | null;
  tax_number: string | null;
  payment_term_uuid?: string | null;
  credit_days: number | null;
  credit_limit: number | null;
  credit_control: CreditControlType;
  is_active: boolean;
  opening_bills?: CustomerOpeningBill[];
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerRequest {
  name: string;
  code?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  country_code?: string | null;
  state_code?: string | null;
  tax_number?: string | null;
  payment_term_id?: number | null;
  credit_days?: number | null;
  credit_limit?: number | null;
  credit_control?: CreditControlType;
  is_active?: boolean;
  opening_bills?: CustomerOpeningBill[];
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CustomerQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}
