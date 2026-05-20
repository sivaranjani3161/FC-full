"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const UserStatus_1 = require("../entities/enums/UserStatus");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    roleId: zod_1.z.coerce.number().int().positive(),
});
exports.updateUserSchema = zod_1.z.object({
    roleId: zod_1.z.coerce.number().int().positive().optional(),
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    status: zod_1.z.nativeEnum(UserStatus_1.UserStatus).optional(),
});
