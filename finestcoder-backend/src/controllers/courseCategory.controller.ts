import { FastifyReply, FastifyRequest } from "fastify";
import { courseCategoryService } from "../services/courseCategory.service";
import { createCourseCategorySchema, updateCourseCategorySchema } from "../schemas/courseCategory.schema";
import { idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const courseCategoryController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await courseCategoryService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch categories");
    }
  },

  async listWithCourses(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await courseCategoryService.listWithCourses());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch categories with courses");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createCourseCategorySchema, req.body);
      const created = await courseCategoryService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create category");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateCourseCategorySchema, req.body);
      return reply.send(await courseCategoryService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update category");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await courseCategoryService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete category");
    }
  },
};
