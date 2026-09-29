// src/features/masters/products/utils/productValidation.ts
import { z } from "zod";
import { ProductType, InventoryTrackingType } from "../types/productTypes";

const productTypeValues = Object.values(ProductType) as [ProductType, ...ProductType[]];
const inventoryTrackingValues = Object.values(InventoryTrackingType) as [InventoryTrackingType, ...InventoryTrackingType[]];

const optionalUuid = z.preprocess(
  (val) => (val === "" ? null : val),
  z.uuid().nullable().optional()
);

export const attributeFormSchema = z.object({
  attribute_name: z.string().min(1, "Name required"),
  attribute_value: z.string().min(1, "Value required"),
});

export const variantFormSchema = z.object({
  uuid: optionalUuid,
  name: z.string().min(1, "Variant Name required"),
  sku: z.string().min(1, "Variant SKU required"),
  barcode: z.string().nullable().optional(),
  purchase_price: z.string().default("0"),
  selling_price: z.string().default("0"),
  is_active: z.boolean().default(true),
  attributes: z.array(attributeFormSchema).default([]),
});

export const productFormSchema = z.object({
  isAutoSku: z.boolean().optional().default(false),
  name: z.string().min(1, "Product name is required"),
  sku: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category_uuid: optionalUuid,
  brand_uuid: optionalUuid,
  unit_uuid: optionalUuid,
  product_type: z.enum(productTypeValues, { message: "Product type required" }),
  inventory_tracking_type: z.enum(inventoryTrackingValues, { message: "Tracking required" }),
  has_expiry: z.boolean().default(false),
  has_warranty: z.boolean().default(false),
  has_variants: z.boolean().default(false),
  purchase_price: z.string().default("0"),
  selling_price: z.string().default("0"),
  minimum_stock: z.string().default("0"),
  maximum_stock: z.string().default("0"),
  reorder_level: z.string().default("0"),
  critical_level: z.string().default("0"),
  manufacturer: z.string().nullable().optional(),
  model_number: z.string().nullable().optional(),
  part_number: z.string().nullable().optional(),
  weight: z.preprocess((v) => (v === "" || v === undefined ? 0 : Number(v)), z.number().default(0)),
  length: z.preprocess((v) => (v === "" || v === undefined ? 0 : Number(v)), z.number().default(0)),
  width: z.preprocess((v) => (v === "" || v === undefined ? 0 : Number(v)), z.number().default(0)),
  height: z.preprocess((v) => (v === "" || v === undefined ? 0 : Number(v)), z.number().default(0)),
  is_active: z.boolean().default(true),
  variants: z.array(variantFormSchema).optional().default([]),
});

export type ProductFormValues = z.input<typeof productFormSchema>;
