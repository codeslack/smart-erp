// src/features/accounting/api/accountingApi.ts

import { apiSlice } from "@/store/apiSlice";
import type {
  ChartOfAccount,
  JournalEntry,
  AccountGroup,
  BalanceSheetResponse,
  ProfitLossResponse,
  PaginatedResponse,
  TrialBalanceResponse,
} from "../types";

export const accountingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChartOfAccounts: builder.query<
      PaginatedResponse<ChartOfAccount>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/accounting/chart-of-accounts",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
    getJournalEntries: builder.query<
      PaginatedResponse<JournalEntry>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/accounting/journal-entries",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
    getAccountGroups: builder.query<
      PaginatedResponse<AccountGroup>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/accounting/account-groups",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
    // Financial Reports Queries
    // Inside your accountingApi endpoint configurations block, change the balance sheet row:
    getBalanceSheet: builder.query<BalanceSheetResponse, void>({
      query: () => ({ url: "/api/accounting/balance-sheet", method: "GET" }),
    }),

    // Inside your accountingApi endpoints configuration block, change the profit-loss row:
    getProfitLoss: builder.query<ProfitLossResponse, void>({
      query: () => ({ url: "/api/accounting/profit-loss", method: "GET" }),
    }),

    // Inside your accountingApi endpoints configuration block, verify the trial-balance row:
    getTrialBalance: builder.query<TrialBalanceResponse, void>({
      query: () => ({ url: "/api/accounting/trial-balance", method: "GET" }),
    }),

    // Add this mutation block straight into your accountingApi slice endpoints registry
    createChartOfAccount: builder.mutation<
      ChartOfAccount,
      Partial<ChartOfAccount>
    >({
      query: (newAccount) => ({
        url: "/api/accounting/chart-of-accounts", // Matches Laravel: POST api/accounting/chart-of-accounts
        method: "POST",
        data: newAccount,
      }),
      invalidatesTags: ["Accounts"], // Instantly forces your Chart of Accounts data grid table to reload!
    }),
  }),
});

export const {
  useGetChartOfAccountsQuery,
  useGetJournalEntriesQuery,
  useGetAccountGroupsQuery,
  useGetBalanceSheetQuery,
  useGetProfitLossQuery,
  useGetTrialBalanceQuery,
  useCreateChartOfAccountMutation,
} = accountingApi;
