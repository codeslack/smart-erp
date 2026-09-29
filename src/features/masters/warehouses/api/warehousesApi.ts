import { apiSlice } from "@/store/apiSlice";
import type { PaginatedWarehouses, Warehouse } from "../types/warehouseTypes";

export const warehousesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWarehouses: builder.query<
      PaginatedWarehouses,
      { page: number; search: string }
    >({
      query: ({ page, search }) => ({
        url: "/api/warehouses",
        method: "GET",
        params: { page, search },
      }),
      providesTags: ["Accounts"],
    }),
    createWarehouse: builder.mutation<Warehouse, Partial<Warehouse>>({
      query: (body) => ({ url: "/api/warehouses", method: "POST", data: body }),
      invalidatesTags: ["Accounts"],
    }),
    updateWarehouse: builder.mutation<
      Warehouse,
      { uuid: string; body: Partial<Warehouse> }
    >({
      query: ({ uuid, body }) => ({
        url: `/api/warehouses/${uuid}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    deleteWarehouse: builder.mutation<void, string>({
      query: (uuid) => ({ url: `/api/warehouses/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehousesApi;
