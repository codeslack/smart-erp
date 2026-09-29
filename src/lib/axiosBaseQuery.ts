// src/lib/axiosBaseQuery.ts

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { apiClient } from "./axios";
import { getMockData } from "./mockData";

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers }) => {
    // 1. Check for local mock datasets before hitting the actual network wire
    const mockPayload = getMockData(url, method, params, data);

    if (mockPayload) {
      //return { data: mockPayload };
    }

    // 2. Production Tunnel Mode (Runs if no mock data matches the requested URL)
    try {
      // All requests are now forwarded directly to your live Laravel server!
      const result = await apiClient({ url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
