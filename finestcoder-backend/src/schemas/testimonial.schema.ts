import { z } from "zod";
import { TestimonialType } from "../entities/enums/TestimonialType";

export const createTestimonialSchema = z.object({
  type: z.nativeEnum(TestimonialType).default(TestimonialType.TEXT),
  name: z.string().optional(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
  createdBy: z.coerce.number().int().positive(),
});

export const updateTestimonialSchema = z.object({
  type: z.nativeEnum(TestimonialType).optional(),
  name: z.string().optional(),
  videoUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});
