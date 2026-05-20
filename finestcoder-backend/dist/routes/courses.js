"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = courseRoutes;
const course_controller_1 = require("../controllers/course.controller");
async function courseRoutes(app) {
    app.get("/courses", course_controller_1.courseController.list);
    app.post("/courses", course_controller_1.courseController.create);
    app.get("/courses/active", course_controller_1.courseController.listActive);
    app.get("/courses/slug/:slug", course_controller_1.courseController.getBySlug);
    app.get("/courses/:id", course_controller_1.courseController.getById);
    app.put("/courses/:id", course_controller_1.courseController.update);
    app.delete("/courses/:id", course_controller_1.courseController.remove);
}
