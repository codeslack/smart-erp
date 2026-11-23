export type ProductType =
  | 'PRODUCT'
  | 'SERVICE'
  | 'RAW_MATERIAL'
  | 'FINISHED_GOOD'
  | 'CONSUMABLE';

export type InventoryTrackingType = 'NONE' | 'BATCH' | 'SERIAL';

export interface Category {
  uuid: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  uuid: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  uuid: string;
  code: string;
  name: string;
  short_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  uuid: string;
  code: string;
  sku: string | null;
  barcode: string | null;
  name: string;
  display_name?: string | null;
  slug?: string | null;
  description: string | null;
  product_type: ProductType;
  inventory_tracking_type: InventoryTrackingType;
  category_uuid?: string | null;
  category_name?: string | null;
  brand_uuid?: string | null;
  brand_name?: string | null;
  unit_uuid?: string | null;
  unit_name?: string | null;
  category?: { uuid: string; name: string };
  brand?: { uuid: string; name: string };
  unit?: { uuid: string; name: string };
  purchase_price: number | null;
  selling_price: number | null;
  minimum_stock: number | null;
  reorder_level: number | null;
  has_expiry: boolean;
  has_variants: boolean;
  has_warranty: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  sku?: string | null;
  barcode?: string | null;
  description?: string | null;
  product_type: ProductType;
  inventory_tracking_type: InventoryTrackingType;
  category_uuid?: string | null;
  brand_uuid?: string | null;
  unit_uuid?: string | null;
  purchase_price?: number | null;
  selling_price?: number | null;
  minimum_stock?: number | null;
  reorder_level?: number | null;
  has_expiry?: boolean;
  has_variants?: boolean;
  has_warranty?: boolean;
  is_active?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_uuid?: string;
  is_active?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  code?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}
