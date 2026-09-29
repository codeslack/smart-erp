import { apiSlice } from "@/store/apiSlice";

export const invoicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query<any, { page: number; search: string }>({
      query: ({ page, search }) => ({
        url: "/api/purchases",
        method: "GET",
        params: { page, search },
      }),
      providesTags: ["Accounts"],
    }),
    createPurchase: builder.mutation<any, Partial<any>>({
      query: (body) => ({ url: "/api/purchases", method: "POST", data: body }),
      invalidatesTags: ["Accounts"],
    }),
    approvePurchase: builder.mutation<any, number>({
      query: (id) => ({ url: `/api/purchases/${id}/approve`, method: "POST" }),
      invalidatesTags: ["Accounts"],
    }),
    deletePurchase: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/purchases/${id}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useApprovePurchaseMutation,
  useDeletePurchaseMutation,
} = invoicesApi;
