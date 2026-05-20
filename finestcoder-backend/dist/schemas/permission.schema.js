"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermissionsSchema = exports.permissionsQuerySchema = void 0;
const zod_1 = require("zod");
exports.permissionsQuerySchema = zod_1.z.object({
    roleId: zod_1.z.coerce.number().int().positive(),
});
exports.updatePermissionsSchema = zod_1.z.object({
    roleId: zod_1.z.coerce.number().int().positive(),
    permissions: zod_1.z.record(zod_1.z.string(), zod_1.z.record(zod_1.z.string(), zod_1.z.boolean())),
});
