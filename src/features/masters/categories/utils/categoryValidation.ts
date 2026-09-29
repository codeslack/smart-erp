// src/features/masters/categories/utils/categoryValidation.ts

import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CategoryFormValues = z.input<typeof categoryFormSchema>;
