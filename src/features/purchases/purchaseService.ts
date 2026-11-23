import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  PurchaseOrder,
  PurchaseInvoice,
  PurchaseReturn,
  PurchaseQueryParams,
} from '@/types/purchase';

export const purchaseService = {
  // Purchase Orders
  async getPurchaseOrders(params?: PurchaseQueryParams): Promise<ApiPaginatedResponse<PurchaseOrder>> {
    const response = await apiClient.get<ApiPaginatedResponse<PurchaseOrder>>('/purchase-orders', {
      params,
    });
    return response.data;
  },

  async getPurchaseOrder(uuid: string): Promise<ApiResponse<PurchaseOrder>> {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/${uuid}`);
    return response.data;
  },

  async confirmPurchaseOrder(uuid: string): Promise<ApiResponse<PurchaseOrder>> {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(
      `/purchase-orders/${uuid}/confirm`
    );
    return response.data;
  },

  async cancelPurchaseOrder(uuid: string): Promise<ApiResponse<PurchaseOrder>> {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(
      `/purchase-orders/${uuid}/cancel`
    );
    return response.data;
  },

  // Purchase Invoices (Bills)
  async getPurchases(params?: PurchaseQueryParams): Promise<ApiPaginatedResponse<PurchaseInvoice>> {
    const response = await apiClient.get<ApiPaginatedResponse<PurchaseInvoice>>('/purchases', {
      params,
    });
    return response.data;
  },

  async getPurchase(uuid: string): Promise<ApiResponse<PurchaseInvoice>> {
    const response = await apiClient.get<ApiResponse<PurchaseInvoice>>(`/purchases/${uuid}`);
    return response.data;
  },

  async confirmPurchase(uuid: string): Promise<ApiResponse<PurchaseInvoice>> {
    const response = await apiClient.post<ApiResponse<PurchaseInvoice>>(`/purchases/${uuid}/confirm`);
    return response.data;
  },

  async cancelPurchase(uuid: string): Promise<ApiResponse<PurchaseInvoice>> {
    const response = await apiClient.post<ApiResponse<PurchaseInvoice>>(`/purchases/${uuid}/cancel`);
    return response.data;
  },

  // Purchase Returns
  async getPurchaseReturns(params?: PurchaseQueryParams): Promise<ApiPaginatedResponse<PurchaseReturn>> {
    const response = await apiClient.get<ApiPaginatedResponse<PurchaseReturn>>('/purchase-returns', {
      params,
    });
    return response.data;
  },

  async approvePurchaseReturn(uuid: string): Promise<ApiResponse<PurchaseReturn>> {
    const response = await apiClient.post<ApiResponse<PurchaseReturn>>(
      `/purchase-returns/${uuid}/approve`
    );
    return response.data;
  },

  async confirmPurchaseReturn(uuid: string): Promise<ApiResponse<PurchaseReturn>> {
    const response = await apiClient.post<ApiResponse<PurchaseReturn>>(
      `/purchase-returns/${uuid}/confirm`
    );
    return response.data;
  },

  async cancelPurchaseReturn(uuid: string): Promise<ApiResponse<PurchaseReturn>> {
    const response = await apiClient.post<ApiResponse<PurchaseReturn>>(
      `/purchase-returns/${uuid}/cancel`
    );
    return response.data;
  },
};
