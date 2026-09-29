export interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string;
  is_active: boolean;
}

export interface LaravelTenantResponse {
  data: Tenant[];
}

export interface User {
  id: number;
  tenant_id: number;
  name: string;
  email: string;
  is_active: string;
  role?: null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedTenantSlug: string | null;
}
