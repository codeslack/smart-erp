// src/features/masters/categories/api/categoriesApi.ts

import { apiSlice } from "@/store/apiSlice";
import type { Category, CategoryFilters, ApiResponse } from "../types/categoryTypes";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<Category[]>, CategoryFilters>({
      query: (params) => {
        const cleanParams = { ...params };
        Object.keys(cleanParams).forEach((key) => {
          const val = cleanParams[key as keyof CategoryFilters];
          if (val === "" || val === null || val === undefined) {
            delete cleanParams[key as keyof CategoryFilters];
          }
        });
        return { url: "/api/categories", method: "GET", params: cleanParams };
      },
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
      query: (payload) => ({ url: "/api/categories", method: "POST", data: payload }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<ApiResponse<Category>, { uuid: string; data: Partial<Category> }>({
      query: ({ uuid, data }) => ({ url: `/api/categories/${uuid}`, method: "PUT", data }),
      invalidatesTags: (_res, _err, arg) => ["Categories", { type: "Categories" as const, id: arg.uuid }],
    }),
    deleteCategory: builder.mutation<ApiResponse<void>, string>({
      query: (uuid) => ({ url: `/api/categories/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
