import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface TenantCompanySettings {
  name: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  tax_number?: string;
  currency?: string;
  timezone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export const settingsService = {
  async getSettings(group: string = 'company'): Promise<ApiResponse<TenantCompanySettings>> {
    const response = await apiClient.get<ApiResponse<TenantCompanySettings>>(`/settings/${group}`);
    return response.data;
  },

  async updateSettings(group: string = 'company', data: Partial<TenantCompanySettings>): Promise<ApiResponse<TenantCompanySettings>> {
    const response = await apiClient.put<ApiResponse<TenantCompanySettings>>(`/settings/${group}`, data);
    return response.data;
  },
};
