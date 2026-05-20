import { z } from "zod";

export const createCourseCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  sortOrder: z.coerce.number().default(0),
});

export const updateCourseCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  sortOrder: z.coerce.number().optional(),
});
