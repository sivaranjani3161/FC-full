import { FastifyReply, FastifyRequest } from "fastify";
import { enquiryService } from "../services/enquiry.service";
import { createEnquirySchema, updateEnquirySchema } from "../schemas/enquiry.schema";
import { idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const enquiryController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await enquiryService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch enquiries");
    }
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await enquiryService.getById(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch enquiry");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createEnquirySchema, req.body);
      const created = await enquiryService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create enquiry");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateEnquirySchema, req.body);
      return reply.send(await enquiryService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update enquiry");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await enquiryService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete enquiry");
    }
  },
};
