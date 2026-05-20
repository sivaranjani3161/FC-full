import { FastifyReply, FastifyRequest } from "fastify";
import { blogService } from "../services/blog.service";
import { createBlogSchema, updateBlogSchema } from "../schemas/blog.schema";
import { idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const blogController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await blogService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch blogs");
    }
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await blogService.getById(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch blog");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createBlogSchema, req.body);
      const created = await blogService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create blog");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateBlogSchema, req.body);
      return reply.send(await blogService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update blog");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await blogService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete blog");
    }
  },
};
