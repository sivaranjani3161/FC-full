import { FastifyInstance } from "fastify";
import { testimonialController } from "../controllers/testimonial.controller";

export default async function testimonialRoutes(app: FastifyInstance) {
  app.get("/testimonials", testimonialController.list);
  app.get("/testimonials/:id", testimonialController.getById);
  app.post("/testimonials", testimonialController.create);
  app.put("/testimonials/:id", testimonialController.update);
  app.delete("/testimonials/:id", testimonialController.remove);
}
