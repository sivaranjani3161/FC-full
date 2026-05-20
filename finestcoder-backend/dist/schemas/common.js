"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedCourseItemSchema = exports.emailParamSchema = exports.slugParamSchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
exports.slugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().trim().min(1),
});
exports.emailParamSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email(),
});
exports.nestedCourseItemSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1),
    description: zod_1.z.array(zod_1.z.string()).optional(),
    icon: zod_1.z.string().nullable().optional(),
    phaseNumber: zod_1.z.coerce.number().optional(),
    sortOrder: zod_1.z.coerce.number().optional(),
});
