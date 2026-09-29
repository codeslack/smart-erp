// src/store/apiSlice.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  // Registers cache tags matching your Laravel endpoints
  tagTypes: [
    "Auth",
    "Areas",
    "Brands",
    "Categories",
    "Units",
    "Products",
    "Variants",
    "Invoices",
    "Accounts",
    "Users",
    "Reports",
  ],
  endpoints: () => ({}), // Modules will safely inject endpoints here later
});
