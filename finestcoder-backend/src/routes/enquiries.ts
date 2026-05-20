import { FastifyInstance } from "fastify";
import { enquiryController } from "../controllers/enquiry.controller";

export default async function enquiryRoutes(app: FastifyInstance) {
  app.get("/enquiries", enquiryController.list);
  app.get("/enquiries/:id", enquiryController.getById);
  app.post("/enquiries", enquiryController.create);
  app.put("/enquiries/:id", enquiryController.update);
  app.delete("/enquiries/:id", enquiryController.remove);
}
