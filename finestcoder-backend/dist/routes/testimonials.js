"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = testimonialRoutes;
const testimonial_controller_1 = require("../controllers/testimonial.controller");
async function testimonialRoutes(app) {
    app.get("/testimonials", testimonial_controller_1.testimonialController.list);
    app.get("/testimonials/:id", testimonial_controller_1.testimonialController.getById);
    app.post("/testimonials", testimonial_controller_1.testimonialController.create);
    app.put("/testimonials/:id", testimonial_controller_1.testimonialController.update);
    app.delete("/testimonials/:id", testimonial_controller_1.testimonialController.remove);
}
