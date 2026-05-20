import { FastifyInstance } from "fastify";
import { uploadController } from "../controllers/upload.controller";

export default async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", uploadController.upload);
}
