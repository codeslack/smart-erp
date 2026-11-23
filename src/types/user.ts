export interface UserRecord {
  uuid: string;
  code: string;
  name: string;
  email: string;
  phone?: string | null;
  is_active: boolean;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  roles?: string[];
  created_at: string;
  updated_at: string;
}

export interface RoleRecord {
  uuid: string;
  name: string;
  guard_name?: string;
  permissions?: Array<{ name: string }>;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  is_active?: boolean;
  roles?: string[];
}

export interface UserQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}
