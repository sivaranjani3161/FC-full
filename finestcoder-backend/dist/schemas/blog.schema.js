"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
const BlogStatus_1 = require("../entities/enums/BlogStatus");
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().nullable().optional(),
    content: zod_1.z.string().default(""),
    coverImage: zod_1.z.string().nullable().optional(),
    publishedAt: zod_1.z.coerce.date().nullable().optional(),
    status: zod_1.z.nativeEnum(BlogStatus_1.BlogStatus).default(BlogStatus_1.BlogStatus.DRAFT),
    createdBy: zod_1.z.coerce.number().int().positive(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    relatedBlogIds: zod_1.z.array(zod_1.z.coerce.number().int().positive()).default([]),
});
exports.updateBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    slug: zod_1.z.string().min(1).optional(),
    excerpt: zod_1.z.string().nullable().optional(),
    content: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().nullable().optional(),
    publishedAt: zod_1.z.coerce.date().nullable().optional(),
    status: zod_1.z.nativeEnum(BlogStatus_1.BlogStatus).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    relatedBlogIds: zod_1.z.array(zod_1.z.coerce.number().int().positive()).optional(),
});
