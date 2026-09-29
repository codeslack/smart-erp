// src/features/masters/products/api/productsApi.ts
import { apiSlice } from "@/store/apiSlice";
import type {
  Product,
  ProductFilters,
  ApiResponse,
  ProductVariant,
  LookupItem,
} from "../types/productTypes";

const normalizeLookup = (res: any) => ({
  success: res.success,
  message: res.message,
  data: Array.isArray(res.data) ? res.data : res.data?.data || [],
});

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Change input parameter type from "ProductFilters" to "Partial<ProductFilters> | void"
    getProducts: builder.query<ApiResponse<Product[]>, Partial<ProductFilters> | void>({
      query: (params) => {
        // Fallback to empty object if no parameters are supplied to the hook
        const cleanParams = { ...(params || {}) };
        Object.keys(cleanParams).forEach((key) => {
          const val = cleanParams[key as keyof ProductFilters];
          if (val === "" || val === null || val === undefined) {
            delete cleanParams[key as keyof ProductFilters];
          }
        });
        return { url: "/api/products", method: "GET", params: cleanParams };
      },
      providesTags: ["Products"],
    }),

    getProductByUuid: builder.query<ApiResponse<Product>, string>({
      query: (uuid) => ({
        url: `/api/products/${uuid}`,
        method: "GET",
      }),
      providesTags: (_res, _err, uuid) => [
        { type: "Products" as const, id: uuid },
      ],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (body) => ({
        url: "/api/products",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { uuid: string; data: Partial<Product> }
    >({
      query: ({ uuid, data }) => ({
        url: `/api/products/${uuid}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        "Products",
        { type: "Products" as const, id: arg.uuid },
      ],
    }),
    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (uuid) => ({ url: `/api/products/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),

    getVariants: builder.query<ApiResponse<ProductVariant[]>, string>({
      query: (productUuid) => ({
        url: `/api/products/${productUuid}/variants`,
        method: "GET",
      }),
      providesTags: ["Variants"],
    }),

    createVariant: builder.mutation<
      ApiResponse<ProductVariant>,
      { productUuid: string; data: Partial<ProductVariant> }
    >({
      query: ({ productUuid, data }) => ({
        url: `/api/products/${productUuid}/variants`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Variants", "Products"],
    }),

    getCategoriesLookup: builder.query<ApiResponse<LookupItem[]>, void>({
      query: () => ({ url: "/api/categories", method: "GET" }),
      transformResponse: normalizeLookup,
    }),

    getBrandsLookup: builder.query<ApiResponse<LookupItem[]>, void>({
      query: () => ({ url: "/api/brands", method: "GET" }),
      transformResponse: normalizeLookup,
    }),

    getUnitsLookup: builder.query<ApiResponse<LookupItem[]>, void>({
      query: () => ({ url: "/api/units", method: "GET" }),
      transformResponse: normalizeLookup,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByUuidQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetVariantsQuery,
  useCreateVariantMutation,
  useGetCategoriesLookupQuery,
  useGetBrandsLookupQuery,
  useGetUnitsLookupQuery,
} = productsApi;
