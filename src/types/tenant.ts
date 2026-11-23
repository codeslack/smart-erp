export type BusinessType =
  | 'GENERAL'
  | 'MEDICINE'
  | 'MOBILE'
  | 'COMPUTER'
  | 'RETAIL'
  | 'SPARE_PARTS'
  | 'MANUFACTURING'
  | 'DISTRIBUTION'
  | 'SERVICE';

export interface Tenant {
  uuid: string;
  code: string;
  name: string;
  slug: string;
  domain?: string | null;
  business_type: BusinessType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTenantPayload {
  name: string;
  slug: string;
  domain?: string | null;
  business_type: BusinessType;
  timezone?: string;
  fiscal_year_start_month?: number;
  fiscal_year_start_day?: number;
  admin_name: string;
  admin_email: string;
  admin_password: string;
  admin_password_confirmation: string;
}

export interface CompanySettings {
  country?: string;
  state?: string;
  city?: string;
  currency?: string;
  timezone?: string;
  date_format?: string;
  decimal_places?: number | string;
  [key: string]: unknown;
}
