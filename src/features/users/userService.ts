import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type { UserRecord, RoleRecord, UserFormData, UserQueryParams } from '@/types/user';

export const userService = {
  async getUsers(params?: UserQueryParams): Promise<ApiPaginatedResponse<UserRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<UserRecord>>('/users', {
      params,
    });
    return response.data;
  },

  async getUser(uuid: string): Promise<ApiResponse<UserRecord>> {
    const response = await apiClient.get<ApiResponse<UserRecord>>(`/users/${uuid}`);
    return response.data;
  },

  async createUser(data: UserFormData): Promise<ApiResponse<UserRecord>> {
    const response = await apiClient.post<ApiResponse<UserRecord>>('/users', data);
    return response.data;
  },

  async updateUser(uuid: string, data: Partial<UserFormData>): Promise<ApiResponse<UserRecord>> {
    const response = await apiClient.put<ApiResponse<UserRecord>>(`/users/${uuid}`, data);
    return response.data;
  },

  async deleteUser(uuid: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/${uuid}`);
    return response.data;
  },

  async getRoles(): Promise<RoleRecord[]> {
    const response = await apiClient.get<any>('/rbac/roles', {
      params: { per_page: 50 },
    });
    if (Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },
};
