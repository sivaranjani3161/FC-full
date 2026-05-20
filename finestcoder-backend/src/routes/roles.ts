import { FastifyInstance } from "fastify";
import { roleController } from "../controllers/role.controller";

export default async function roleRoutes(app: FastifyInstance) {
  app.get("/roles", roleController.list);
  app.post("/roles", roleController.create);
  app.put("/roles/:id", roleController.update);
  app.delete("/roles/:id", roleController.remove);
}
