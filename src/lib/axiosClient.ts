import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios'; // FIXED: Moved to type-only import

// 1. Initialize the custom Axios client instance linked to your Laravel server
export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0',
  timeout: 30000, // 30-second timeout for heavy ERP processing requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Request Interceptor: Automatically inject your Laravel auth token into headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('erp_auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Capture and handle backend statuses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Handle session expirations cleanly
    if (status === 401) {
      localStorage.removeItem('erp_auth_token');
      // Force page routing to login page if unauthorized
      window.location.href = '/login';
    }

    // Handle forbidden operations (unauthorized tenant or bad RBAC permission)
    if (status === 403) {
      console.error('[ERP Security Alert]: Access denied to this endpoint.');
    }

    // Return the rejection so components or RTK Query can extract validation messages (e.g., status 422)
    return Promise.reject(error);
  }
);
