import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { apiClient } from "./axios";

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
    try {
      // Execute the request via your central Axios client configuration
      const result = await apiClient({
        url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          // Safely extracts data payloads (e.g., Laravel's 422 error arrays)
          data: err.response?.data || err.message,
        },
      };
    }
  };
