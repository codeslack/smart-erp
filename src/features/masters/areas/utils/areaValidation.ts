// src/features/masters/areas/utils/areaValidation.ts
import { z } from "zod";

export const areaFormSchema = z.object({
  name: z.string().min(1, "Area name is required").max(100),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type AreaFormValues = z.input<typeof areaFormSchema>;
