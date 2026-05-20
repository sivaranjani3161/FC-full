"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = exports.nestedCourseItemSchema = void 0;
const zod_1 = require("zod");
exports.nestedCourseItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.array(zod_1.z.string()).optional().default([]),
    icon: zod_1.z.string().nullable().optional(),
    phaseNumber: zod_1.z.coerce.number().optional(),
    sortOrder: zod_1.z.coerce.number().optional().default(0),
});
exports.createCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    description: zod_1.z.string().nullable().optional(),
    heroImage: zod_1.z.string().nullable().optional(),
    isActive: zod_1.z.boolean().default(true),
    categoryId: zod_1.z.coerce.number().int().positive().nullable().optional(),
    createdBy: zod_1.z.coerce.number().int().positive(),
    courseHighlights: zod_1.z.array(exports.nestedCourseItemSchema).default([]),
    courseFeatures: zod_1.z.array(exports.nestedCourseItemSchema).default([]),
    courseStructure: zod_1.z.array(exports.nestedCourseItemSchema).default([]),
});
exports.updateCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    slug: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().nullable().optional(),
    heroImage: zod_1.z.string().nullable().optional(),
    isActive: zod_1.z.boolean().optional(),
    categoryId: zod_1.z.coerce.number().int().positive().nullable().optional(),
    courseHighlights: zod_1.z.array(exports.nestedCourseItemSchema).optional(),
    courseFeatures: zod_1.z.array(exports.nestedCourseItemSchema).optional(),
    courseStructure: zod_1.z.array(exports.nestedCourseItemSchema).optional(),
});
