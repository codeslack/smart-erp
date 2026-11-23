import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type { Brand, Unit } from '@/types/product';

export interface AreaRecord {
  uuid: string;
  code: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AreaFormData {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface WarehouseRecord {
  uuid: string;
  code: string;
  name: string;
  area_uuid?: string | null;
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
  // Areas
  async getAreas(): Promise<ApiPaginatedResponse<AreaRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<AreaRecord>>('/areas');
    return response.data;
  },

  async getArea(uuid: string): Promise<ApiResponse<AreaRecord>> {
    const response = await apiClient.get<ApiResponse<AreaRecord>>(`/areas/${uuid}`);
    return response.data;
  },

  async createArea(data: AreaFormData): Promise<ApiResponse<AreaRecord>> {
    const response = await apiClient.post<ApiResponse<AreaRecord>>('/areas', data);
    return response.data;
  },

  async updateArea(uuid: string, data: Partial<AreaFormData>): Promise<ApiResponse<AreaRecord>> {
    const response = await apiClient.put<ApiResponse<AreaRecord>>(`/areas/${uuid}`, data);
    return response.data;
  },

  async deleteArea(uuid: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/areas/${uuid}`);
    return response.data;
  },

  // Warehouses
  async getWarehouses(): Promise<ApiPaginatedResponse<WarehouseRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<WarehouseRecord>>('/warehouses');
    return response.data;
  },

  // Brands & Units
  async getBrands(): Promise<ApiPaginatedResponse<Brand>> {
    const response = await apiClient.get<ApiPaginatedResponse<Brand>>('/brands');
    return response.data;
  },

  async getUnits(): Promise<ApiPaginatedResponse<Unit>> {
    const response = await apiClient.get<ApiPaginatedResponse<Unit>>('/units');
    return response.data;
  },

  // Payment Terms
  async getPaymentTerms(): Promise<ApiPaginatedResponse<PaymentTermRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<PaymentTermRecord>>('/payment-terms');
    return response.data;
  },
};
