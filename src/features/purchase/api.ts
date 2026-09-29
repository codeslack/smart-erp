// src/features/purchase/api.ts
import { apiSlice } from "@/store/apiSlice";
import type {
  PaginatedResponse,
  PurchaseInvoice,
  PurchaseOrder,
  GoodsReceiptNote,
  PurchaseReturn,
} from "./types";

export const purchaseModuleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Invoices / Purchases Endpoints (/api/purchases)
    getPurchases: builder.query<
      PaginatedResponse<PurchaseInvoice>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/purchases",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
    createPurchase: builder.mutation<PurchaseInvoice, Partial<PurchaseInvoice>>(
      {
        query: (body) => ({
          url: "/api/purchases",
          method: "POST",
          data: body,
        }),
        invalidatesTags: ["Accounts"],
      },
    ),
    approvePurchase: builder.mutation<any, number>({
      query: (id) => ({ url: `/api/purchases/${id}/approve`, method: "POST" }),
      invalidatesTags: ["Accounts"],
    }),
    deletePurchase: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/purchases/${id}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),

    // 2. Purchase Orders Endpoints (/api/purchase-orders)
    getPurchaseOrders: builder.query<
      PaginatedResponse<PurchaseOrder>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/purchase-orders",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),
    createPurchaseOrder: builder.mutation<
      PurchaseOrder,
      Partial<PurchaseOrder>
    >({
      query: (body) => ({
        url: "/api/purchase-orders",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),

    approvePurchaseOrder: builder.mutation<any, number>({
      query: (id) => ({
        url: `/api/purchase-orders/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Accounts"],
    }),

    // 3. Goods Receipt Notes Endpoints (/api/goods-receipt-notes)
    getGRNs: builder.query<
      PaginatedResponse<GoodsReceiptNote>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/goods-receipt-notes",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),

    createGRN: builder.mutation<GoodsReceiptNote, Partial<GoodsReceiptNote>>({
      query: (body) => ({
        url: "/api/goods-receipt-notes",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),

    // 4. Purchase Returns Endpoints (/api/purchase-returns)
    getPurchaseReturns: builder.query<
      PaginatedResponse<PurchaseReturn>,
      { page: number }
    >({
      query: ({ page }) => ({
        url: "/api/purchase-returns",
        method: "GET",
        params: { page },
      }),
      providesTags: ["Accounts"],
    }),

    createPurchaseReturn: builder.mutation<
      PurchaseReturn,
      Partial<PurchaseReturn>
    >({
      query: (body) => ({
        url: "/api/purchase-returns",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useApprovePurchaseMutation,
  useDeletePurchaseMutation,
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useCreateGRNMutation,
  useApprovePurchaseOrderMutation,
  useGetGRNsQuery,
  useGetPurchaseReturnsQuery,
  useCreatePurchaseReturnMutation,
} = purchaseModuleApi;
