"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = courseCategoryRoutes;
const courseCategory_controller_1 = require("../controllers/courseCategory.controller");
async function courseCategoryRoutes(app) {
    app.get("/course-categories", courseCategory_controller_1.courseCategoryController.list);
    app.get("/course-categories/with-courses", courseCategory_controller_1.courseCategoryController.listWithCourses);
    app.post("/course-categories", courseCategory_controller_1.courseCategoryController.create);
    app.put("/course-categories/:id", courseCategory_controller_1.courseCategoryController.update);
    app.delete("/course-categories/:id", courseCategory_controller_1.courseCategoryController.remove);
}
