"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleController = void 0;
const role_service_1 = require("../services/role.service");
const role_schema_1 = require("../schemas/role.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.roleController = {
    async list(_req, reply) {
        try {
            return reply.send(await role_service_1.roleService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch roles");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(role_schema_1.createRoleSchema, req.body);
            const created = await role_service_1.roleService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create role");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(role_schema_1.updateRoleSchema, req.body);
            return reply.send(await role_service_1.roleService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update role");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await role_service_1.roleService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete role");
        }
    },
};
