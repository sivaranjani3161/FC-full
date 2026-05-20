import { z } from "zod";

export const galleryQuerySchema = z.object({
  type: z.enum(["internal", "external"]).optional(),
});

export const galleryImageSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().min(1),
  altText: z.string().nullable().optional(),
});

export const createExternalGallerySchema = z.object({
  type: z.literal("external").default("external"),
  title: z.string().min(1),
  slug: z.string().min(1),
  location: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  eventDate: z.coerce.date().nullable().optional(),
  createdBy: z.coerce.number().int().positive(),
  galleryImages: z.array(galleryImageSchema).default([]),
});

export const createInternalGallerySchema = z.object({
  type: z.literal("internal"),
  imageUrl: z.string().min(1),
  altText: z.string().nullable().optional(),
});

export const createGallerySchema = z.union([
  createInternalGallerySchema,
  createExternalGallerySchema,
]);

export const updateExternalGallerySchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  eventDate: z.coerce.date().nullable().optional(),
  galleryImages: z.array(galleryImageSchema).optional(),
});

export const updateInternalGallerySchema = z.object({
  imageUrl: z.string().optional(),
  altText: z.string().nullable().optional(),
});
