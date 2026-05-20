import { FastifyInstance } from "fastify";
import { permissionController } from "../controllers/permission.controller";

export { MODULES, OPERATIONS } from "../constants/permissions";
export type { PermCode } from "../constants/permissions";

export default async function permissionRoutes(app: FastifyInstance) {
  app.get("/permissions", permissionController.getByRole);
  app.put("/permissions", permissionController.replace);
  app.get("/permissions/all", permissionController.getAll);
}
