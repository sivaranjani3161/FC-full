import { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { emailParamSchema, idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams } from "../utils/validation";

export const userController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(await userService.list());
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch users");
    }
  },

  async getByEmail(req: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) {
    try {
      const { email } = parseParams(emailParamSchema, { email: decodeURIComponent(req.params.email) });
      return reply.send(await userService.getByEmail(email));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch user");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseBody(createUserSchema, req.body);
      const created = await userService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create user");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const body = parseBody(updateUserSchema, req.body);
      return reply.send(await userService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update user");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      await userService.remove(id);
      return reply.status(204).send();
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete user");
    }
  },
};
