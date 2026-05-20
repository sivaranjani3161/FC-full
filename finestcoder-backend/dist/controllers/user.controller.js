"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../services/user.service");
const user_schema_1 = require("../schemas/user.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.userController = {
    async list(_req, reply) {
        try {
            return reply.send(await user_service_1.userService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch users");
        }
    },
    async getByEmail(req, reply) {
        try {
            const { email } = (0, validation_1.parseParams)(common_1.emailParamSchema, { email: decodeURIComponent(req.params.email) });
            return reply.send(await user_service_1.userService.getByEmail(email));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch user");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(user_schema_1.createUserSchema, req.body);
            const created = await user_service_1.userService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create user");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(user_schema_1.updateUserSchema, req.body);
            return reply.send(await user_service_1.userService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update user");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            await user_service_1.userService.remove(id);
            return reply.status(204).send();
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete user");
        }
    },
};
