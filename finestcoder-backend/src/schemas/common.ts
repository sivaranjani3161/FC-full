import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export const emailParamSchema = z.object({
  email: z.string().trim().email(),
});

export const nestedCourseItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.array(z.string()).optional(),
  icon: z.string().nullable().optional(),
  phaseNumber: z.coerce.number().optional(),
  sortOrder: z.coerce.number().optional(),
});
