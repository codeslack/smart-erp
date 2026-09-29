// src/features/masters/units/api/unitsApi.ts
import { apiSlice } from "@/store/apiSlice";
import type { Unit, UnitFilters, ApiResponse } from "../types/unitTypes";

export const unitsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<ApiResponse<Unit[]>, UnitFilters>({
      query: (params) => {
        const cleanParams = { ...params };
        Object.keys(cleanParams).forEach((key) => {
          const val = cleanParams[key as keyof UnitFilters];
          if (val === "" || val === null || val === undefined) {
            delete cleanParams[key as keyof UnitFilters];
          }
        });
        return { url: "/api/units", method: "GET", params: cleanParams };
      },
      providesTags: ["Products"], // Linked directly to global Product invalidation layers
    }),
    createUnit: builder.mutation<ApiResponse<Unit>, Partial<Unit>>({
      query: (payload) => ({ url: "/api/units", method: "POST", data: payload }),
      invalidatesTags: ["Products"],
    }),
    updateUnit: builder.mutation<ApiResponse<Unit>, { uuid: string; data: Partial<Unit> }>({
      query: ({ uuid, data }) => ({ url: `/api/units/${uuid}`, method: "PUT", data }),
      invalidatesTags: ["Products"],
    }),
    deleteUnit: builder.mutation<ApiResponse<void>, string>({
      query: (uuid) => ({ url: `/api/units/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitsApi;
