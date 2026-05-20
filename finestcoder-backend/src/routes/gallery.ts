import { FastifyInstance } from "fastify";
import { galleryController } from "../controllers/gallery.controller";

export default async function galleryRoutes(app: FastifyInstance) {
  app.get("/gallery", galleryController.list);
  app.get("/gallery/:id", galleryController.getById);
  app.post("/gallery", galleryController.create);
  app.put("/gallery/:id", galleryController.update);
  app.delete("/gallery/:id", galleryController.remove);
}
