import { apiSlice } from "@/store/apiSlice";
import type { PaginatedCustomers, Customer } from "../types/customerTypes";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<
      PaginatedCustomers,
      { page: number; search: string }
    >({
      query: ({ page, search }) => ({
        url: "/api/customers",
        method: "GET",
        params: { page, search },
      }),
      providesTags: ["Accounts"],
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({ url: "/api/customers", method: "POST", data: body }),
      invalidatesTags: ["Accounts"],
    }),
    updateCustomer: builder.mutation<
      Customer,
      { id: number; body: Partial<Customer> }
    >({
      query: ({ id, body }) => ({
        url: `/api/customers/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteCustomer: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/customers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
