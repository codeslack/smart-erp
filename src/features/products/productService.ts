import apiClient from '@/lib/axios';
import type { ApiResponse, ApiPaginatedResponse } from '@/types/api';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Brand,
  Unit,
} from '@/types/product';

export const productService = {
  // Products
  async getProducts(params: ProductQueryParams = {}): Promise<ApiPaginatedResponse<Product>> {
    const response = await apiClient.get<ApiPaginatedResponse<Product>>('/products', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 15,
        ...(params.search ? { search: params.search } : {}),
      },
    });
    return response.data;
  },

  async getProduct(uuid: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${uuid}`);
    return response.data.data;
  },

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  async updateProduct(uuid: string, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${uuid}`, data);
    return response.data.data;
  },

  async deleteProduct(uuid: string): Promise<void> {
    await apiClient.delete(`/products/${uuid}`);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiPaginatedResponse<Category>>('/categories', {
      params: { per_page: 100 },
    });
    return response.data.data;
  },

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  async updateCategory(uuid: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${uuid}`, data);
    return response.data.data;
  },

  async deleteCategory(uuid: string): Promise<void> {
    await apiClient.delete(`/categories/${uuid}`);
  },

  // Brands & Units for selectors
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<ApiPaginatedResponse<Brand>>('/brands', {
      params: { per_page: 100 },
    });
    return response.data.data;
  },

  async getUnits(): Promise<Unit[]> {
    const response = await apiClient.get<ApiPaginatedResponse<Unit>>('/units', {
      params: { per_page: 100 },
    });
    return response.data.data;
  },
};
