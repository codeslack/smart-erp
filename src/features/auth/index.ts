// src/features/auth/index.ts

// FIXED: Added setAuthSession to explicit module state exports
export { authReducer, clearAuth, setAuthSession } from './store/authSlice';

export { 
  authApi, 
  useFetchUserTenantsMutation, 
  useLoginWithTenantMutation, 
  useGetMeQuery, 
  useLogoutMutation 
} from './api/authApi';

export { Login } from './views/Login';
