// src/features/masters/brands/api/brandsApi.ts
import { apiSlice } from "@/store/apiSlice";
import type { Brand, BrandFilters, ApiResponse } from "../types/brandTypes";

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<ApiResponse<Brand[]>, BrandFilters>({
      query: (params) => {
        const cleanParams = { ...params };
        Object.keys(cleanParams).forEach((key) => {
          const val = cleanParams[key as keyof BrandFilters];
          if (val === "" || val === null || val === undefined) {
            delete cleanParams[key as keyof BrandFilters];
          }
        });
        return { url: "/api/brands", method: "GET", params: cleanParams };
      },
      providesTags: ["Brands"],
    }),
    createBrand: builder.mutation<ApiResponse<Brand>, Partial<Brand>>({
      query: (payload) => ({ url: "/api/brands", method: "POST", data: payload }),
      invalidatesTags: ["Brands"],
    }),
    updateBrand: builder.mutation<ApiResponse<Brand>, { uuid: string; data: Partial<Brand> }>({
      query: ({ uuid, data }) => ({ url: `/api/brands/${uuid}`, method: "PUT", data }),
      invalidatesTags: (_res, _err, arg) => ["Brands", { type: "Brands" as const, id: arg.uuid }],
    }),
    deleteBrand: builder.mutation<ApiResponse<void>, string>({
      query: (uuid) => ({ url: `/api/brands/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
