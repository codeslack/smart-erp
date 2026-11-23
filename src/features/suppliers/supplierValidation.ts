import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required').max(255, 'Name too long'),
  code: z.string().max(50, 'Code too long').optional().nullable(),
  contact_person: z.string().max(255, 'Contact person too long').optional().nullable(),
  phone: z.string().max(50, 'Phone too long').optional().nullable(),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal(''))
    .nullable(),
  address: z.string().optional().nullable(),
  tax_number: z.string().max(100, 'Tax number too long').optional().nullable(),
  credit_days: z.number().min(0, 'Credit days cannot be negative').optional().nullable(),
  credit_limit: z.number().min(0, 'Credit limit cannot be negative').optional().nullable(),
  credit_control: z.enum(['none', 'warn', 'block']),
  is_active: z.boolean(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
