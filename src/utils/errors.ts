import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.errors ?? null;
  }
  return null;
}

export function extractValidationErrors(error: unknown): Record<string, string[]> {
  return getValidationErrors(error) ?? {};
}

export function getFirstValidationError(error: unknown): string | null {
  const errors = getValidationErrors(error);
  if (!errors) return null;

  const firstKey = Object.keys(errors)[0];
  if (!firstKey || !errors[firstKey] || errors[firstKey].length === 0) return null;

  return errors[firstKey][0];
}
