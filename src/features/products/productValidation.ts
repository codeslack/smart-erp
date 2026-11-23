import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Name too long'),
  sku: z.string().max(100, 'SKU too long').optional().nullable(),
  barcode: z.string().max(100, 'Barcode too long').optional().nullable(),
  description: z.string().optional().nullable(),
  product_type: z.enum([
    'PRODUCT',
    'SERVICE',
    'RAW_MATERIAL',
    'FINISHED_GOOD',
    'CONSUMABLE',
  ]),
  inventory_tracking_type: z.enum(['NONE', 'BATCH', 'SERIAL']),
  category_uuid: z.string().optional().nullable(),
  brand_uuid: z.string().optional().nullable(),
  unit_uuid: z.string().optional().nullable(),
  purchase_price: z.number().min(0, 'Purchase price cannot be negative').optional().nullable(),
  selling_price: z.number().min(0, 'Selling price cannot be negative').optional().nullable(),
  minimum_stock: z.number().min(0).optional().nullable(),
  reorder_level: z.number().min(0).optional().nullable(),
  is_active: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Name too long'),
  code: z.string().max(50, 'Code too long').optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
