// src/lib/axios.ts

import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'https://smart-erp-api.test',
  timeout: 30000,
  withCredentials: true, 
  withXSRFToken: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Core Authorization Token Injection
    const token = localStorage.getItem('erp_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /* 
      FIXED: Read the active tenant slug directly from disk storage space!
      This breaks the circular dependency chain by removing the need to import 'store'.
    */
    const tenantSlug = localStorage.getItem('erp_active_tenant_slug');

    if (tenantSlug && config.headers) {
      config.headers['X-Tenant'] = tenantSlug; // Pass tenant header safely
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('erp_auth_token');
      localStorage.removeItem('erp_active_tenant_slug');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
