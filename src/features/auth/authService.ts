import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { User, LoginCredentials, AuthResponseData } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('/auth/logout');
  },
};
