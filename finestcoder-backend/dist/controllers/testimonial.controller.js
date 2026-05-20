"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialController = void 0;
const testimonial_service_1 = require("../services/testimonial.service");
const testimonial_schema_1 = require("../schemas/testimonial.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.testimonialController = {
    async list(_req, reply) {
        try {
            return reply.send(await testimonial_service_1.testimonialService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch testimonials");
        }
    },
    async getById(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await testimonial_service_1.testimonialService.getById(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch testimonial");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(testimonial_schema_1.createTestimonialSchema, req.body);
            const created = await testimonial_service_1.testimonialService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create testimonial");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(testimonial_schema_1.updateTestimonialSchema, req.body);
            return reply.send(await testimonial_service_1.testimonialService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update testimonial");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await testimonial_service_1.testimonialService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete testimonial");
        }
    },
};
