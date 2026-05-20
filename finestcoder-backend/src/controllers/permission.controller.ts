import { FastifyReply, FastifyRequest } from "fastify";
import { permissionService } from "../services/permission.service";
import { permissionsQuerySchema, updatePermissionsSchema } from "../schemas/permission.schema";
import { handleControllerError } from "../utils/http";
import { parseBody, parseQuery } from "../utils/validation";

export const permissionController = {
  async getByRole(req: FastifyRequest<{ Querystring: { roleId: string } }>, reply: FastifyReply) {
    try {
      const { roleId } = parseQuery(permissionsQuerySchema, req.query);
      return reply.send(await permissionService.getByRole(roleId));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch permissions");
    }
  },

  async replace(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(updatePermissionsSchema, req.body);
      return reply.send(await permissionService.replaceForRole(body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update permissions");
    }
  },

  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await permissionService.getAllGrouped());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch permissions");
    }
  },
};
