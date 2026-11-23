import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  ChartOfAccount,
  JournalEntry,
  PaymentRecord,
  TrialBalanceReport,
  ProfitLossReport,
  BalanceSheetReport,
  AccountingQueryParams,
} from '@/types/accounting';

export const accountingService = {
  // Chart of Accounts
  async getChartOfAccounts(params?: AccountingQueryParams): Promise<ApiPaginatedResponse<ChartOfAccount>> {
    const response = await apiClient.get<ApiPaginatedResponse<ChartOfAccount>>(
      '/accounting/chart-of-accounts',
      { params }
    );
    return response.data;
  },

  async getChartOfAccount(uuid: string): Promise<ApiResponse<ChartOfAccount>> {
    const response = await apiClient.get<ApiResponse<ChartOfAccount>>(
      `/accounting/chart-of-accounts/${uuid}`
    );
    return response.data;
  },

  // Journal Entries
  async getJournalEntries(params?: AccountingQueryParams): Promise<ApiPaginatedResponse<JournalEntry>> {
    const response = await apiClient.get<ApiPaginatedResponse<JournalEntry>>(
      '/accounting/journal-entries',
      { params }
    );
    return response.data;
  },

  async postJournalEntry(uuid: string): Promise<ApiResponse<JournalEntry>> {
    const response = await apiClient.post<ApiResponse<JournalEntry>>(
      `/accounting/journal-entries/${uuid}/post`
    );
    return response.data;
  },

  async cancelJournalEntry(uuid: string): Promise<ApiResponse<JournalEntry>> {
    const response = await apiClient.post<ApiResponse<JournalEntry>>(
      `/accounting/journal-entries/${uuid}/cancel`
    );
    return response.data;
  },

  // Payments & Receipts
  async getPayments(params?: AccountingQueryParams): Promise<ApiPaginatedResponse<PaymentRecord>> {
    const response = await apiClient.get<ApiPaginatedResponse<PaymentRecord>>('/payments', {
      params,
    });
    return response.data;
  },

  async confirmPayment(uuid: string): Promise<ApiResponse<PaymentRecord>> {
    const response = await apiClient.post<ApiResponse<PaymentRecord>>(`/payments/${uuid}/confirm`);
    return response.data;
  },

  async cancelPayment(uuid: string): Promise<ApiResponse<PaymentRecord>> {
    const response = await apiClient.post<ApiResponse<PaymentRecord>>(`/payments/${uuid}/cancel`);
    return response.data;
  },

  // Financial Reports
  async getTrialBalance(): Promise<ApiResponse<TrialBalanceReport>> {
    const response = await apiClient.get<ApiResponse<TrialBalanceReport>>(
      '/accounting/trial-balance'
    );
    return response.data;
  },

  async getProfitLoss(): Promise<ApiResponse<ProfitLossReport>> {
    const response = await apiClient.get<ApiResponse<ProfitLossReport>>(
      '/accounting/profit-loss'
    );
    return response.data;
  },

  async getBalanceSheet(): Promise<ApiResponse<BalanceSheetReport>> {
    const response = await apiClient.get<ApiResponse<BalanceSheetReport>>(
      '/accounting/balance-sheet'
    );
    return response.data;
  },
};
