import type { ThemeMode } from '@/types/common';
import type { Tenant } from '@/types/tenant';

const TOKEN_KEY = 'smart_erp_token';
const USER_KEY = 'smart_erp_user';
const TENANT_KEY = 'smart_erp_tenant';
const THEME_KEY = 'smart_erp_theme';

export const storage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.error('Failed to save auth token to localStorage', err);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.error('Failed to remove auth token from localStorage', err);
    }
  },

  getUser: <T>(): T | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  setUser: <T>(user: T): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user info to localStorage', err);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Failed to remove user info from localStorage', err);
    }
  },

  getTenant: (): Tenant | null => {
    try {
      const raw = localStorage.getItem(TENANT_KEY);
      return raw ? (JSON.parse(raw) as Tenant) : null;
    } catch {
      return null;
    }
  },

  setTenant: (tenant: Tenant): void => {
    try {
      localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
    } catch (err) {
      console.error('Failed to save tenant info to localStorage', err);
    }
  },

  removeTenant: (): void => {
    try {
      localStorage.removeItem(TENANT_KEY);
    } catch (err) {
      console.error('Failed to remove tenant info from localStorage', err);
    }
  },

  getTheme: (): ThemeMode => {
    try {
      const theme = localStorage.getItem(THEME_KEY);
      if (theme === 'dark' || theme === 'light') return theme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  },

  setTheme: (theme: ThemeMode): void => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.error('Failed to save theme preference', err);
    }
  },

  clearSession: (): void => {
    storage.removeToken();
    storage.removeUser();
    storage.removeTenant();
  },
};
