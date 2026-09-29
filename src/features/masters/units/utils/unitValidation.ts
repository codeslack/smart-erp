// src/features/masters/units/utils/unitValidation.ts
import { z } from "zod";

export const unitFormSchema = z.object({
  name: z.string().min(1, "Unit name is required").max(100),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type UnitFormValues = z.input<typeof unitFormSchema>;
