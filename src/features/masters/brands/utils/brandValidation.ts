// src/features/masters/brands/utils/brandValidation.ts
import { z } from "zod";

export const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type BrandFormValues = z.input<typeof brandFormSchema>;
