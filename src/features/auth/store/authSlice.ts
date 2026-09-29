import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('erp_auth_token'),
  isAuthenticated: !!localStorage.getItem('erp_auth_token'),
  // FIXED: Read tenant slug from local storage on initial load fallback
  selectedTenantSlug: localStorage.getItem('erp_active_tenant_slug'), 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSession: (state, action: PayloadAction<{ token: string; user: User; tenantSlug: string }>) => {
      localStorage.setItem('erp_auth_token', action.payload.token);
      localStorage.setItem('erp_active_tenant_slug', action.payload.tenantSlug); // FIXED: Persist slug to disk
      
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.selectedTenantSlug = action.payload.tenantSlug;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      localStorage.removeItem('erp_auth_token');
      localStorage.removeItem('erp_active_tenant_slug'); // FIXED: Wipe slug on clear down
      state.user = null;
      state.token = null;
      state.selectedTenantSlug = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthSession, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
