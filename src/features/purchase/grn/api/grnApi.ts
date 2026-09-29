import { apiSlice } from "@/store/apiSlice";

export const grnApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGRNs: builder.query<{ data: any[]; meta: any }, { page: number }>({
      query: ({ page }) => ({
        url: "/api/goods-receipt-notes",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
  }),
});

export const { useGetGRNsQuery } = grnApi;
