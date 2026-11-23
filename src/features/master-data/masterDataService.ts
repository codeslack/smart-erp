import apiClient from '@/lib/axios';
import type { ApiPaginatedResponse } from '@/types/api';
import type { Brand, Unit } from '@/types/product';

export interface WarehouseRecord {
  uuid: string;
  code: string;
  name: string;
  area_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTermRecord {
  uuid: string;
  code: string;
  name: string;
  due_days: number;
  discount_days?: number | null;
  discount_percent?: number | null;
  grace_days?: number | null;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const masterDataService = {
  async getWarehouses(): Promise<ApiPaginatedResponse<WarehouseRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<WarehouseRecord>>('/warehouses');
    return response.data;
  },

  async getBrands(): Promise<ApiPaginatedResponse<Brand>> {
    const response = await apiClient.get<ApiPaginatedResponse<Brand>>('/brands');
    return response.data;
  },

  async getUnits(): Promise<ApiPaginatedResponse<Unit>> {
    const response = await apiClient.get<ApiPaginatedResponse<Unit>>('/units');
    return response.data;
  },

  async getPaymentTerms(): Promise<ApiPaginatedResponse<PaymentTermRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<PaymentTermRecord>>('/payment-terms');
    return response.data;
  },
};
