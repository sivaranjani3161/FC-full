"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = blogRoutes;
const blog_controller_1 = require("../controllers/blog.controller");
async function blogRoutes(app) {
    app.get("/blogs", blog_controller_1.blogController.list);
    app.get("/blogs/:id", blog_controller_1.blogController.getById);
    app.post("/blogs", blog_controller_1.blogController.create);
    app.put("/blogs/:id", blog_controller_1.blogController.update);
    app.delete("/blogs/:id", blog_controller_1.blogController.remove);
}
