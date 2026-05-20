import { FastifyReply, FastifyRequest } from "fastify";
import { roleService } from "../services/role.service";
import { createRoleSchema, updateRoleSchema } from "../schemas/role.schema";
import { idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const roleController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await roleService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch roles");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createRoleSchema, req.body);
      const created = await roleService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create role");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateRoleSchema, req.body);
      return reply.send(await roleService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update role");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await roleService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete role");
    }
  },
};
