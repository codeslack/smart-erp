import { apiSlice } from "@/store/apiSlice";
import type { PaginatedSuppliers, Supplier } from "../types/supplierTypes";

export const suppliersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<
      PaginatedSuppliers,
      { page: number; search: string }
    >({
      query: ({ page, search }) => ({
        url: "/api/suppliers",
        method: "GET",
        params: { page, search },
      }),
      providesTags: ["Accounts"],
    }),
    createSupplier: builder.mutation<Supplier, Partial<Supplier>>({
      query: (body) => ({ url: "/api/suppliers", method: "POST", data: body }),
      invalidatesTags: ["Accounts"],
    }),
    updateSupplier: builder.mutation<
      Supplier,
      { id: number; body: Partial<Supplier> }
    >({
      query: ({ id, body }) => ({
        url: `/api/suppliers/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteSupplier: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/suppliers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
