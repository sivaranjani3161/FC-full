"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionController = void 0;
const permission_service_1 = require("../services/permission.service");
const permission_schema_1 = require("../schemas/permission.schema");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.permissionController = {
    async getByRole(req, reply) {
        try {
            const { roleId } = (0, validation_1.parseQuery)(permission_schema_1.permissionsQuerySchema, req.query);
            return reply.send(await permission_service_1.permissionService.getByRole(roleId));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch permissions");
        }
    },
    async replace(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(permission_schema_1.updatePermissionsSchema, req.body);
            return reply.send(await permission_service_1.permissionService.replaceForRole(body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update permissions");
        }
    },
    async getAll(_req, reply) {
        try {
            return reply.send(await permission_service_1.permissionService.getAllGrouped());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch permissions");
        }
    },
};
