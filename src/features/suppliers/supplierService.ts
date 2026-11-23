import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  SupplierQueryParams,
} from '@/types/supplier';

export const supplierService = {
  /**
   * Fetch paginated list of suppliers
   */
  async getSuppliers(params: SupplierQueryParams = {}): Promise<ApiPaginatedResponse<Supplier>> {
    const response = await apiClient.get<ApiPaginatedResponse<Supplier>>('/suppliers', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        ...(params.search ? { search: params.search } : {}),
      },
    });
    return response.data;
  },

  /**
   * Fetch single supplier by UUID
   */
  async getSupplier(uuid: string): Promise<Supplier> {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${uuid}`);
    return response.data.data;
  },

  /**
   * Create new supplier
   */
  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', data);
    return response.data.data;
  },

  /**
   * Update existing supplier
   */
  async updateSupplier(uuid: string, data: UpdateSupplierRequest): Promise<Supplier> {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${uuid}`, data);
    return response.data.data;
  },

  /**
   * Delete supplier by UUID
   */
  async deleteSupplier(uuid: string): Promise<void> {
    await apiClient.delete(`/suppliers/${uuid}`);
  },
};
