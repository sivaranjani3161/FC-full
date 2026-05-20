"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialSchema = exports.createTestimonialSchema = void 0;
const zod_1 = require("zod");
const TestimonialType_1 = require("../entities/enums/TestimonialType");
exports.createTestimonialSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(TestimonialType_1.TestimonialType).default(TestimonialType_1.TestimonialType.TEXT),
    name: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().optional(),
    thumbnailUrl: zod_1.z.string().nullable().optional(),
    role: zod_1.z.string().nullable().optional(),
    company: zod_1.z.string().nullable().optional(),
    title: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
    createdBy: zod_1.z.coerce.number().int().positive(),
});
exports.updateTestimonialSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(TestimonialType_1.TestimonialType).optional(),
    name: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().nullable().optional(),
    thumbnailUrl: zod_1.z.string().nullable().optional(),
    role: zod_1.z.string().nullable().optional(),
    company: zod_1.z.string().nullable().optional(),
    title: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    isActive: zod_1.z.boolean().optional(),
});
