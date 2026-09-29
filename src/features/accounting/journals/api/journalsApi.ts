import { apiSlice } from "@/store/apiSlice";
import type { PaginatedJournals, JournalVoucher } from "../types/journalTypes";

export const journalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJournals: builder.query<PaginatedJournals, { page: number }>({
      query: ({ page }) => ({
        url: "/api/accounting/journal-entries",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
    createJournal: builder.mutation<JournalVoucher, Partial<JournalVoucher>>({
      query: (body) => ({
        url: "/api/accounting/journal-entries",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    updateJournal: builder.mutation<
      JournalVoucher,
      { id: number; body: Partial<JournalVoucher> }
    >({
      query: ({ id, body }) => ({
        url: `/api/accounting/journal-entries/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteJournal: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/accounting/journal-entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounts"],
    }),

    // Inside your existing journalsApi configuration block, add these two mutations:
    postJournalVoucher: builder.mutation<JournalVoucher, number>({
      query: (id) => ({
        url: `/api/accounting/journal-entries/${id}/post`,
        method: "POST",
      }),
      invalidatesTags: ["Accounts"],
    }),
    cancelJournalVoucher: builder.mutation<JournalVoucher, number>({
      query: (id) => ({
        url: `/api/accounting/journal-entries/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetJournalsQuery,
  useCreateJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
  usePostJournalVoucherMutation,
  useCancelJournalVoucherMutation,
} = journalsApi;
