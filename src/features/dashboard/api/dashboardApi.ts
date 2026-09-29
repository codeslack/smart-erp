import { apiSlice } from '@/store/apiSlice';

export interface DashboardMetrics {
  total_revenue: number;
  open_receivables: number;
  active_personnel: number;
  ledger_solvency: number;
  recent_activity: {
    id: number;
    description: string;
    timestamp: string;
    type: 'invoice' | 'ledger' | 'user';
  }[];
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Connects to Laravel route blueprint: Route::get('/dashboard/summary')
    getDashboardSummary: builder.query<DashboardMetrics, void>({
      query: () => ({ url: '/api/auth/me', method: 'GET' }),
      providesTags: ['Invoices', 'Accounts', 'Users'], // Refetches when sub-modules shift tags
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
