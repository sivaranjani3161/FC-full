import { FastifyInstance } from "fastify";
import { userController } from "../controllers/user.controller";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/users", userController.list);
  app.get("/users/by-email/:email", userController.getByEmail);
  app.post("/users", userController.create);
  app.put("/users/:id", userController.update);
  app.delete("/users/:id", userController.remove);
}
