import { FastifyInstance } from "fastify";
import { courseCategoryController } from "../controllers/courseCategory.controller";

export default async function courseCategoryRoutes(app: FastifyInstance) {
  app.get("/course-categories", courseCategoryController.list);
  app.get("/course-categories/with-courses", courseCategoryController.listWithCourses);
  app.post("/course-categories", courseCategoryController.create);
  app.put("/course-categories/:id", courseCategoryController.update);
  app.delete("/course-categories/:id", courseCategoryController.remove);
}
