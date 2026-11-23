export interface User {
  uuid: string;
  code?: string | null;
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
  token_type: string;
}
