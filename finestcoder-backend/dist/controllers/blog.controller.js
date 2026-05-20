"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const blog_service_1 = require("../services/blog.service");
const blog_schema_1 = require("../schemas/blog.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.blogController = {
    async list(_req, reply) {
        try {
            return reply.send(await blog_service_1.blogService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch blogs");
        }
    },
    async getById(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await blog_service_1.blogService.getById(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch blog");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(blog_schema_1.createBlogSchema, req.body);
            const created = await blog_service_1.blogService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create blog");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(blog_schema_1.updateBlogSchema, req.body);
            return reply.send(await blog_service_1.blogService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update blog");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await blog_service_1.blogService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete blog");
        }
    },
};
