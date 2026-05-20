"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseCategorySchema = exports.createCourseCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCourseCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().nullable().optional(),
    sortOrder: zod_1.z.coerce.number().default(0),
});
exports.updateCourseCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    slug: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().nullable().optional(),
    sortOrder: zod_1.z.coerce.number().optional(),
});
