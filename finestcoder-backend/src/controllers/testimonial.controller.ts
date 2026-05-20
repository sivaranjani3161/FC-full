import { FastifyReply, FastifyRequest } from "fastify";
import { testimonialService } from "../services/testimonial.service";
import { createTestimonialSchema, updateTestimonialSchema } from "../schemas/testimonial.schema";
import { idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const testimonialController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await testimonialService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch testimonials");
    }
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await testimonialService.getById(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch testimonial");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createTestimonialSchema, req.body);
      const created = await testimonialService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create testimonial");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateTestimonialSchema, req.body);
      return reply.send(await testimonialService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update testimonial");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await testimonialService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete testimonial");
    }
  },
};
