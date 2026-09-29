// src/features/masters/products/utils/productValidation.ts

import { z } from "zod";
import { ProductType, InventoryTrackingType } from "../types/productTypes";

const productTypeValues = Object.values(ProductType) as [ProductType, ...ProductType[]];
const inventoryTrackingValues = Object.values(InventoryTrackingType) as [InventoryTrackingType, ...InventoryTrackingType[]];

// Preprocessor helper to transform empty selection strings into clean null values
const emptyToNullUuid = z.preprocess(
  (val) => (val === "" ? null : val), 
  z.string().uuid().nullable().optional()
);

export const productFormSchema = z
  .object({
    // Form-only client side control tracker state
    isAutoSku: z.boolean().optional().default(false),

    name: z.string().min(1, "Name is required").max(255),
    sku: z.string().min(1, "SKU is required").max(100),
    barcode: z.string().nullable().optional(),
    description: z.string().nullable().optional(),

    // Correctly apply the preprocessor to clear out TS errors
    category_uuid: emptyToNullUuid,
    brand_uuid: emptyToNullUuid,
    unit_uuid: emptyToNullUuid,
    
    product_type: z.enum(productTypeValues, { message: "Product type is required" }),
    inventory_tracking_type: z.enum(inventoryTrackingValues, { message: "Tracking type is required" }),

    has_expiry: z.boolean().default(false),
    has_warranty: z.boolean().default(false),
    has_variants: z.boolean().default(false),

    purchase_price: z.coerce.string().min(0, "Purchase price must be greater than or equal to 0"),
    selling_price: z.coerce.string().min(0, "Selling price must be greater than or equal to 0"),

    minimum_stock: z.coerce.string().min(0, "Minimum stock must be greater than or equal to 0"),
    maximum_stock: z.coerce.string().min(0, "Maximum stock must be greater than or equal to 0"),
    reorder_level: z.coerce.string().min(0, "Reorder level must be greater than or equal to 0"),
    critical_level: z.coerce.string().min(0, "Critical level must be greater than or equal to 0"),

    manufacturer: z.string().nullable().optional(),
    model_number: z.string().nullable().optional(),
    part_number: z.string().nullable().optional(),

    weight: z.coerce.number().nullable().optional(),
    length: z.coerce.number().nullable().optional(),
    width: z.coerce.number().nullable().optional(),
    height: z.coerce.number().nullable().optional(),
    is_active: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.inventory_tracking_type === InventoryTrackingType.NONE) {
      if (data.has_expiry) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["has_expiry"], message: "Expiry tracking not supported for this type" });
      if (data.has_warranty) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["has_warranty"], message: "Warranty tracking not supported for this type" });
      if (data.has_variants) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["has_variants"], message: "Variants not supported for this type" });
    }
    if (data.inventory_tracking_type === InventoryTrackingType.BATCH && data.has_warranty) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["has_warranty"], message: "Warranty cannot be checked on Batch tracking" });
    }
    if (data.inventory_tracking_type === InventoryTrackingType.SERIAL && data.has_expiry) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["has_expiry"], message: "Expiry cannot be checked on Serial tracking" });
    }
  });

export const variantFormSchema = z.object({
  name: z.string().min(1, "Variant Name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  barcode: z.string().nullable().optional(),
  purchase_price: z.coerce.string().min(0, "Purchase price must be >= 0"),
  selling_price: z.coerce.string().min(0, "Selling price must be >= 0"),
  is_active: z.boolean().default(true),
  attributes: z
    .array(
      z.object({
        attribute_name: z.string().min(1, "Key is required"),
        attribute_value: z.string().min(1, "Value is required"),
      }),
    )
    .min(1, "At least one attribute must be provided"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type VariantFormValues = z.infer<typeof variantFormSchema>;
