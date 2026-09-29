// src/features/masters/products/types/productTypes.ts

export const ProductType = {
  PRODUCT: "PRODUCT",
  SERVICE: "SERVICE",
  RAW_MATERIAL: "RAW_MATERIAL",
  FINISHED_GOOD: "FINISHED_GOOD",
  CONSUMABLE: "CONSUMABLE",
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export const InventoryTrackingType = {
  NONE: "NONE",
  BATCH: "BATCH",
  SERIAL: "SERIAL",
} as const;

export type InventoryTrackingType = (typeof InventoryTrackingType)[keyof typeof InventoryTrackingType];

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ProductAttribute {
  attribute_name: string;
  attribute_value: string;
}

export interface ProductVariant {
  uuid: string;
  product_uuid: string;
  code: string;
  sku: string;
  barcode: string | null;
  name: string;
  purchase_price: string;
  selling_price: string;
  is_active: boolean;
  attributes: ProductAttribute[];
  created_at: string;
}

export interface Product {
  uuid: string;
  code: string;
  sku: string;
  barcode: string | null;
  name: string;
  display_name: string;
  description: string | null;
  category_uuid: string | null;
  category_name?: string;
  brand_uuid: string | null;
  brand_name?: string;
  unit_uuid: string | null;
  unit_name?: string;
  product_type: ProductType;
  inventory_tracking_type: InventoryTrackingType;
  has_expiry: boolean;
  has_warranty: boolean;
  has_variants: boolean;
  purchase_price: string;
  selling_price: string;
  minimum_stock: string;
  maximum_stock: string;
  reorder_level: string;
  critical_level: string;
  manufacturer: string | null;
  model_number: string | null;
  part_number: string | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  is_active: boolean;
  created_at: string;
  variants_count?: number;
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_uuid?: string;
  brand_uuid?: string;
  product_type?: string;
  is_active?: string;
  sort_by?: "name" | "code" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface LookupItem {
  uuid: string;
  name: string;
}

export type LookupResponse = ApiResponse<LookupItem[]>;