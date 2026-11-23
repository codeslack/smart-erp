import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { storage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Attach Sanctum Bearer token from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Response interceptor: Global 401 & 403 (Tenant Required) handling
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ code?: string; message?: string }>;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      // Handle 401 Unauthorized (session expired or invalid token)
      if (status === 401) {
        storage.clearSession();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden with TENANT_REQUIRED
      if (
        status === 403 &&
        (data?.code === 'TENANT_REQUIRED' ||
          data?.message?.toLowerCase().includes('no tenant is assigned'))
      ) {
        storage.removeTenant();
        window.dispatchEvent(new CustomEvent('auth:tenant_required'));

        if (!window.location.pathname.includes('/onboarding/tenant')) {
          window.location.href = '/onboarding/tenant';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
