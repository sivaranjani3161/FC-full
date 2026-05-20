import { z } from "zod";
import { BlogStatus } from "../entities/enums/BlogStatus";

export const createBlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().nullable().optional(),
  content: z.string().default(""),
  coverImage: z.string().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  status: z.nativeEnum(BlogStatus).default(BlogStatus.DRAFT),
  createdBy: z.coerce.number().int().positive(),
  tags: z.array(z.string()).default([]),
  relatedBlogIds: z.array(z.coerce.number().int().positive()).default([]),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  status: z.nativeEnum(BlogStatus).optional(),
  tags: z.array(z.string()).optional(),
  relatedBlogIds: z.array(z.coerce.number().int().positive()).optional(),
});
