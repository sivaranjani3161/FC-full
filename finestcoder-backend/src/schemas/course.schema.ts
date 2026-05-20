import { z } from "zod";

export const nestedCourseItemSchema = z.object({
  title: z.string().min(1),
  description: z.array(z.string()).optional().default([]),
  icon: z.string().nullable().optional(),
  phaseNumber: z.coerce.number().optional(),
  sortOrder: z.coerce.number().optional().default(0),
});

export const createCourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  heroImage: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  createdBy: z.coerce.number().int().positive(),
  courseHighlights: z.array(nestedCourseItemSchema).default([]),
  courseFeatures: z.array(nestedCourseItemSchema).default([]),
  courseStructure: z.array(nestedCourseItemSchema).default([]),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  heroImage: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  courseHighlights: z.array(nestedCourseItemSchema).optional(),
  courseFeatures: z.array(nestedCourseItemSchema).optional(),
  courseStructure: z.array(nestedCourseItemSchema).optional(),
});
