// src/features/masters/areas/api/areasApi.ts
import { apiSlice } from "@/store/apiSlice";
import type { Area, AreaFilters, ApiResponse } from "../types/areaTypes";

export const areasApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<ApiResponse<Area[]>, AreaFilters>({
      query: (params) => {
        const cleanParams = { ...params };
        Object.keys(cleanParams).forEach((key) => {
          const val = cleanParams[key as keyof AreaFilters];
          if (val === "" || val === null || val === undefined) {
            delete cleanParams[key as keyof AreaFilters];
          }
        });
        return { url: "/api/areas", method: "GET", params: cleanParams };
      },
      providesTags: ["Areas"],
    }),
    createArea: builder.mutation<ApiResponse<Area>, Partial<Area>>({
      query: (payload) => ({ url: "/api/areas", method: "POST", data: payload }),
      invalidatesTags: ["Areas"],
    }),
    updateArea: builder.mutation<ApiResponse<Area>, { uuid: string; data: Partial<Area> }>({
      query: ({ uuid, data }) => ({ url: `/api/areas/${uuid}`, method: "PUT", data }),
      invalidatesTags: (_res, _err, arg) => ["Areas", { type: "Areas" as const, id: arg.uuid }],
    }),
    deleteArea: builder.mutation<ApiResponse<void>, string>({
      query: (uuid) => ({ url: `/api/areas/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["Areas"],
    }),
  }),
});

export const {
  useGetAreasQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
} = areasApi;
