import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerQueryParams,
} from '@/types/customer';

export const customerService = {
  /**
   * Fetch paginated list of customers
   */
  async getCustomers(params: CustomerQueryParams = {}): Promise<ApiPaginatedResponse<Customer>> {
    const response = await apiClient.get<ApiPaginatedResponse<Customer>>('/customers', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        ...(params.search ? { search: params.search } : {}),
      },
    });
    return response.data;
  },

  /**
   * Fetch single customer by UUID
   */
  async getCustomer(uuid: string): Promise<Customer> {
    const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${uuid}`);
    return response.data.data;
  },

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
    return response.data.data;
  },

  /**
   * Update existing customer
   */
  async updateCustomer(uuid: string, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${uuid}`, data);
    return response.data.data;
  },

  /**
   * Delete customer by UUID
   */
  async deleteCustomer(uuid: string): Promise<void> {
    await apiClient.delete(`/customers/${uuid}`);
  },
};
