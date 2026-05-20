import { FastifyInstance } from "fastify";
import { blogController } from "../controllers/blog.controller";

export default async function blogRoutes(app: FastifyInstance) {
  app.get("/blogs", blogController.list);
  app.get("/blogs/:id", blogController.getById);
  app.post("/blogs", blogController.create);
  app.put("/blogs/:id", blogController.update);
  app.delete("/blogs/:id", blogController.remove);
}
