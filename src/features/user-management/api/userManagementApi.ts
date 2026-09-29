import { apiSlice } from '@/store/apiSlice';
import type { User, LaravelPagination } from '../types';

export const userManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Connects to: https://smart-erp-api.test/api/users?page=1
    getUsers: builder.query<LaravelPagination<User>, { page: number }>({
      query: ({ page }) => ({ 
        url: '/api/users', 
        method: 'GET',
        params: { page }
      }),
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: '/api/users',
        method: 'POST',
        data: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = userManagementApi;
