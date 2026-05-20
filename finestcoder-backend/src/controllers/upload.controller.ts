import { FastifyReply, FastifyRequest } from "fastify";
import { uploadService } from "../services/upload.service";
import { handleControllerError, sendError } from "../utils/http";

export const uploadController = {
  async upload(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await req.file();
      if (!data) return sendError(reply, 400, "No file uploaded");

      const result = await uploadService.saveFromStream(data.file, data.filename);
      return reply.send(result);
    } catch (error) {
      return handleControllerError(reply, error, "Failed to upload file");
    }
  },
};
