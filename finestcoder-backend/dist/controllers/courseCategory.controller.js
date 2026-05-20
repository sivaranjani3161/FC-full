"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseCategoryController = void 0;
const courseCategory_service_1 = require("../services/courseCategory.service");
const courseCategory_schema_1 = require("../schemas/courseCategory.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.courseCategoryController = {
    async list(_req, reply) {
        try {
            return reply.send(await courseCategory_service_1.courseCategoryService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch categories");
        }
    },
    async listWithCourses(_req, reply) {
        try {
            return reply.send(await courseCategory_service_1.courseCategoryService.listWithCourses());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch categories with courses");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(courseCategory_schema_1.createCourseCategorySchema, req.body);
            const created = await courseCategory_service_1.courseCategoryService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create category");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(courseCategory_schema_1.updateCourseCategorySchema, req.body);
            return reply.send(await courseCategory_service_1.courseCategoryService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update category");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await courseCategory_service_1.courseCategoryService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete category");
        }
    },
};
