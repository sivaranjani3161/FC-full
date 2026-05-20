"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryController = void 0;
const enquiry_service_1 = require("../services/enquiry.service");
const enquiry_schema_1 = require("../schemas/enquiry.schema");
const common_1 = require("../schemas/common");
const http_1 = require("../utils/http");
const validation_1 = require("../utils/validation");
exports.enquiryController = {
    async list(_req, reply) {
        try {
            return reply.send(await enquiry_service_1.enquiryService.list());
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch enquiries");
        }
    },
    async getById(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await enquiry_service_1.enquiryService.getById(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to fetch enquiry");
        }
    },
    async create(req, reply) {
        try {
            const body = (0, validation_1.parseBody)(enquiry_schema_1.createEnquirySchema, req.body);
            const created = await enquiry_service_1.enquiryService.create(body);
            return reply.status(201).send(created);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to create enquiry");
        }
    },
    async update(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            const body = (0, validation_1.parseBody)(enquiry_schema_1.updateEnquirySchema, req.body);
            return reply.send(await enquiry_service_1.enquiryService.update(id, body));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to update enquiry");
        }
    },
    async remove(req, reply) {
        try {
            const { id } = (0, validation_1.parseParams)(common_1.idParamSchema, req.params);
            return reply.send(await enquiry_service_1.enquiryService.remove(id));
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to delete enquiry");
        }
    },
};
