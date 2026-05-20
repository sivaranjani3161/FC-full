import { FastifyReply, FastifyRequest } from "fastify";
import { courseService } from "../services/course.service";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema";
import { idParamSchema, slugParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const courseController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await courseService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch courses");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createCourseSchema, req.body);
      const created = await courseService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create course");
    }
  },

  async listActive(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await courseService.listActive());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch active courses");
    }
  },

  async getBySlug(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    try {
      const { slug } = parseParams(slugParamSchema, req.params);
      return reply.send(await courseService.getBySlug(slug));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch course");
    }
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await courseService.getById(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch course");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateCourseSchema, req.body);
      return reply.send(await courseService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update course");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await courseService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete course");
    }
  },
};
