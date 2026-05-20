import { FastifyInstance } from "fastify";
import { courseController } from "../controllers/course.controller";

export default async function courseRoutes(app: FastifyInstance) {
  app.get("/courses", courseController.list);
  app.post("/courses", courseController.create);
  app.get("/courses/active", courseController.listActive);
  app.get("/courses/slug/:slug", courseController.getBySlug);
  app.get("/courses/:id", courseController.getById);
  app.put("/courses/:id", courseController.update);
  app.delete("/courses/:id", courseController.remove);
}
