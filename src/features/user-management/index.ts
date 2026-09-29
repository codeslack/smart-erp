// src/features/user-management/index.ts

// 1. Export the main directory table grid component view layout
export { UserList } from './views/UserList';

// 2. Export the short, isolated employee onboarding form layout drawer component
export { AddUserModalForm } from './views/AddUserModalForm';

// 3. FIXED: Export ONLY your RTK Query user caching query & mutation hooks
export { 
  userManagementApi, 
  useGetUsersQuery, 
  useCreateUserMutation 
} from './api/userManagementApi';
