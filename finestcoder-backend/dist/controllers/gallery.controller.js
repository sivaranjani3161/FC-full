"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryController = void 0;
const gallery_service_1 = require("../services/gallery.service");
const gallery_schema_1 = require("../schemas/gallery.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
function parseCreateBody(body) {
    const raw = body;
    if (raw?.type === "internal") {
        return (0, validation_1.parseBody)(gallery_schema_1.createInternalGallerySchema, body);
    }
    return (0, validation_1.parseBody)(gallery_schema_1.createExternalGallerySchema, { type: "external", ...body });
}
exports.galleryController = {
    async list(req, reply) {
        try {
            const query = (0, validation_1.parseQuery)(gallery_schema_1.galleryQuerySchema, req.query);
            return reply.send(await gallery_service_1.galleryService.list(query.type));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch gallery events");
        }
    },
    async getById(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await gallery_service_1.galleryService.getById(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch gallery event");
        }
    },
    async create(req, reply) {
        try {
            const body = parseCreateBody(req.body);
            const created = await gallery_service_1.galleryService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create gallery entry");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const event = await gallery_service_1.galleryService.getById(id);
            const body = event.type === "internal"
                ? (0, validation_1.parseBody)(gallery_schema_1.updateInternalGallerySchema, req.body)
                : (0, validation_1.parseBody)(gallery_schema_1.updateExternalGallerySchema, req.body);
            return reply.send(await gallery_service_1.galleryService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update gallery entry");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await gallery_service_1.galleryService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete gallery entry");
        }
    },
};
