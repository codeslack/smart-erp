import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { storage } from '@/utils/storage';
import type { User } from '@/types/auth';
import type { Tenant } from '@/types/tenant';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  hasTenant: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialToken = storage.getToken();
const initialUser = storage.getUser<User>();
const initialTenant = storage.getTenant();

const initialState: AuthState = {
  user: initialUser,
  tenant: initialTenant,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  // In Laravel backend, a successful session implies an active tenant unless TENANT_REQUIRED was encountered
  hasTenant: Boolean(initialToken && initialTenant !== null) || Boolean(initialToken),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; tenant?: Tenant | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hasTenant = true;
      state.error = null;
      storage.setToken(action.payload.token);
      storage.setUser(action.payload.user);

      if (action.payload.tenant) {
        state.tenant = action.payload.tenant;
        storage.setTenant(action.payload.tenant);
      } else {
        const existingTenant = storage.getTenant();
        if (existingTenant) {
          state.tenant = existingTenant;
        } else {
          // Initialize active tenant metadata for the authenticated workspace
          state.tenant = {
            uuid: action.payload.user.uuid,
            code: 'CMP-001',
            name: 'Company Workspace',
            slug: 'company-workspace',
            business_type: 'GENERAL',
            is_active: true,
            created_at: action.payload.user.created_at,
            updated_at: action.payload.user.updated_at,
          };
          storage.setTenant(state.tenant);
        }
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      storage.setUser(action.payload);
    },
    setTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenant = action.payload;
      state.hasTenant = true;
      storage.setTenant(action.payload);
    },
    clearTenant: (state) => {
      state.tenant = null;
      state.hasTenant = false;
      storage.removeTenant();
    },
    logout: (state) => {
      state.user = null;
      state.tenant = null;
      state.token = null;
      state.isAuthenticated = false;
      state.hasTenant = false;
      state.error = null;
      storage.clearSession();
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCredentials,
  setUser,
  setTenant,
  clearTenant,
  logout,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;
