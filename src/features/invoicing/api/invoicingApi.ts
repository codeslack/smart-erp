// src/features/invoicing/api/invoicingApi.ts
import { apiSlice } from '@/store/apiSlice';
import type { InvoicingDashboardPayload } from '../types';

export const invoicingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Connects to Laravel Endpoint Route: GET /api/invoices?page=1&search=acme
    getInvoicingDashboard: builder.query<InvoicingDashboardPayload, { page: number; search: string }>({
      query: ({ page, search }) => ({
        url: '/api/invoices',
        method: 'GET',
        params: { page, search },
      }),
      providesTags: ['Invoices'],
    }),
  }),
});

export const { useGetInvoicingDashboardQuery } = invoicingApi;
