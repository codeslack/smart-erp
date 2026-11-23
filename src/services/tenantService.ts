import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Tenant, CreateTenantPayload, CompanySettings } from '@/types/tenant';

export const tenantService = {
  /**
   * Public self-service company / tenant registration endpoint.
   * Directly creates tenant, admin user, chart of accounts, and financial year.
   */
  createTenant: async (payload: CreateTenantPayload): Promise<Tenant> => {
    const response = await apiClient.post<ApiResponse<Tenant>>(
      '/tenants',
      payload
    );
    return response.data.data;
  },

  /**
   * Fetches active tenant company settings.
   * Endpoint: GET /api/settings/company
   */
  getCompanySettings: async (): Promise<CompanySettings> => {
    const response = await apiClient.get<ApiResponse<CompanySettings>>(
      '/settings/company'
    );
    return response.data.data;
  },

  /**
   * Updates tenant company settings.
   * Endpoint: PUT /api/settings/company
   */
  updateCompanySettings: async (
    settings: Partial<CompanySettings>
  ): Promise<CompanySettings> => {
    const response = await apiClient.put<ApiResponse<CompanySettings>>(
      '/settings/company',
      settings
    );
    return response.data.data;
  },
};
