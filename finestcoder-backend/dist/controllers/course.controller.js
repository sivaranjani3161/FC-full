"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const course_service_1 = require("../services/course.service");
const course_schema_1 = require("../schemas/course.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.courseController = {
    async list(_req, reply) {
        try {
            return reply.send(await course_service_1.courseService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch courses");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(course_schema_1.createCourseSchema, req.body);
            const created = await course_service_1.courseService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create course");
        }
    },
    async listActive(_req, reply) {
        try {
            return reply.send(await course_service_1.courseService.listActive());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch active courses");
        }
    },
    async getBySlug(req, reply) {
        try {
            const { slug } = (0, validation_1.parseParams)(common_1.slugParamSchema, req.params);
            return reply.send(await course_service_1.courseService.getBySlug(slug));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch course");
        }
    },
    async getById(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await course_service_1.courseService.getById(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch course");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(course_schema_1.updateCourseSchema, req.body);
            return reply.send(await course_service_1.courseService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update course");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await course_service_1.courseService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete course");
        }
    },
};
