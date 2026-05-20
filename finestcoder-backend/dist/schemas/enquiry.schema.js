"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquirySchema = exports.createEnquirySchema = void 0;
const zod_1 = require("zod");
const EnquiryStatus_1 = require("../entities/enums/EnquiryStatus");
exports.createEnquirySchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().nullable().optional(),
    message: zod_1.z.string().nullable().optional(),
    courseId: zod_1.z.coerce.number().int().positive().nullable().optional(),
    status: zod_1.z.nativeEnum(EnquiryStatus_1.EnquiryStatus).default(EnquiryStatus_1.EnquiryStatus.NEW),
});
exports.updateEnquirySchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().nullable().optional(),
    message: zod_1.z.string().nullable().optional(),
    courseId: zod_1.z.coerce.number().int().positive().nullable().optional(),
    status: zod_1.z.nativeEnum(EnquiryStatus_1.EnquiryStatus).optional(),
});
