import { FastifyReply, FastifyRequest } from "fastify";
import { galleryService } from "../services/gallery.service";
import {
  createExternalGallerySchema,
  createInternalGallerySchema,
  galleryQuerySchema,
  updateExternalGallerySchema,
  updateInternalGallerySchema,
} from "../schemas/gallery.schema";
import { idParamSchema } from "../schemas/common";
import { handleControllerError } from "../utils/http";
import { parseBody, parseParams, parseQuery } from "../utils/validation";

function parseCreateBody(body: unknown) {
  const raw = body as { type?: string };
  if (raw?.type === "internal") {
    return parseBody(createInternalGallerySchema, body);
  }
  return parseBody(createExternalGallerySchema, { type: "external", ...(body as object) });
}

export const galleryController = {
  async list(req: FastifyRequest<{ Querystring: { type?: string } }>, reply: FastifyReply) {
    try {
      const query = parseQuery(galleryQuerySchema, req.query);
      return reply.send(await galleryService.list(query.type));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch gallery events");
    }
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await galleryService.getById(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to fetch gallery event");
    }
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = parseCreateBody(req.body);
      const created = await galleryService.create(body);
      return reply.status(201).send(created);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to create gallery entry");
    }
  },

  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      const event = await galleryService.getById(id);
      const body =
        event.type === "internal"
          ? parseBody(updateInternalGallerySchema, req.body)
          : parseBody(updateExternalGallerySchema, req.body);
      return reply.send(await galleryService.update(id, body));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to update gallery entry");
    }
  },

  async remove(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = parseParams(idParamSchema, req.params);
      return reply.send(await galleryService.remove(id));
    } catch (error) {
      return handleControllerError(reply, error, "Failed to delete gallery entry");
    }
  },
};
