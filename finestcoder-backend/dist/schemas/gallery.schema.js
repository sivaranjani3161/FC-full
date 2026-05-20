"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInternalGallerySchema = exports.updateExternalGallerySchema = exports.createGallerySchema = exports.createInternalGallerySchema = exports.createExternalGallerySchema = exports.galleryImageSchema = exports.galleryQuerySchema = void 0;
const zod_1 = require("zod");
exports.galleryQuerySchema = zod_1.z.object({
    type: zod_1.z.enum(["internal", "external"]).optional(),
});
exports.galleryImageSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive().optional(),
    imageUrl: zod_1.z.string().min(1),
    altText: zod_1.z.string().nullable().optional(),
});
exports.createExternalGallerySchema = zod_1.z.object({
    type: zod_1.z.literal("external").default("external"),
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    location: zod_1.z.string().nullable().optional(),
    coverImage: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    eventDate: zod_1.z.coerce.date().nullable().optional(),
    createdBy: zod_1.z.coerce.number().int().positive(),
    galleryImages: zod_1.z.array(exports.galleryImageSchema).default([]),
});
exports.createInternalGallerySchema = zod_1.z.object({
    type: zod_1.z.literal("internal"),
    imageUrl: zod_1.z.string().min(1),
    altText: zod_1.z.string().nullable().optional(),
});
exports.createGallerySchema = zod_1.z.union([
    exports.createInternalGallerySchema,
    exports.createExternalGallerySchema,
]);
exports.updateExternalGallerySchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    slug: zod_1.z.string().min(1).optional(),
    location: zod_1.z.string().nullable().optional(),
    coverImage: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    eventDate: zod_1.z.coerce.date().nullable().optional(),
    galleryImages: zod_1.z.array(exports.galleryImageSchema).optional(),
});
exports.updateInternalGallerySchema = zod_1.z.object({
    imageUrl: zod_1.z.string().optional(),
    altText: zod_1.z.string().nullable().optional(),
});
