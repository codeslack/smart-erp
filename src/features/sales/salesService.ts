import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  Sale,
  SalesOrder,
  SalesQuotation,
  SalesQueryParams,
} from '@/types/sales';

export const salesService = {
  // Sales Invoices
  async getSales(params: SalesQueryParams = {}): Promise<ApiPaginatedResponse<Sale>> {
    const response = await apiClient.get<ApiPaginatedResponse<Sale>>('/sales', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        ...(params.status ? { status: params.status } : {}),
      },
    });
    return response.data;
  },

  async getSale(uuid: string): Promise<Sale> {
    const response = await apiClient.get<ApiResponse<Sale>>(`/sales/${uuid}`);
    return response.data.data;
  },

  async confirmSale(uuid: string): Promise<Sale> {
    const response = await apiClient.post<ApiResponse<Sale>>(`/sales/${uuid}/confirm`);
    return response.data.data;
  },

  async cancelSale(uuid: string): Promise<Sale> {
    const response = await apiClient.post<ApiResponse<Sale>>(`/sales/${uuid}/cancel`);
    return response.data.data;
  },

  // Sales Orders
  async getSalesOrders(params: SalesQueryParams = {}): Promise<ApiPaginatedResponse<SalesOrder>> {
    const response = await apiClient.get<ApiPaginatedResponse<SalesOrder>>('/sales-orders', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        ...(params.status ? { status: params.status } : {}),
      },
    });
    return response.data;
  },

  async confirmSalesOrder(uuid: string): Promise<SalesOrder> {
    const response = await apiClient.post<ApiResponse<SalesOrder>>(`/sales-orders/${uuid}/confirm`);
    return response.data.data;
  },

  async cancelSalesOrder(uuid: string): Promise<SalesOrder> {
    const response = await apiClient.post<ApiResponse<SalesOrder>>(`/sales-orders/${uuid}/cancel`);
    return response.data.data;
  },

  // Sales Quotations
  async getSalesQuotations(params: SalesQueryParams = {}): Promise<ApiPaginatedResponse<SalesQuotation>> {
    const response = await apiClient.get<ApiPaginatedResponse<SalesQuotation>>('/sales-quotations', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        ...(params.status ? { status: params.status } : {}),
      },
    });
    return response.data;
  },

  async sendQuotation(uuid: string): Promise<SalesQuotation> {
    const response = await apiClient.post<ApiResponse<SalesQuotation>>(`/sales-quotations/${uuid}/send`);
    return response.data.data;
  },

  async acceptQuotation(uuid: string): Promise<SalesQuotation> {
    const response = await apiClient.post<ApiResponse<SalesQuotation>>(`/sales-quotations/${uuid}/accept`);
    return response.data.data;
  },

  async rejectQuotation(uuid: string): Promise<SalesQuotation> {
    const response = await apiClient.post<ApiResponse<SalesQuotation>>(`/sales-quotations/${uuid}/reject`);
    return response.data.data;
  },

  async convertQuotationToOrder(uuid: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(`/sales-quotations/${uuid}/convert-to-order`);
    return response.data.data;
  },
};
