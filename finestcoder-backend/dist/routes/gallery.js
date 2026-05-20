"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = galleryRoutes;
const gallery_controller_1 = require("../controllers/gallery.controller");
async function galleryRoutes(app) {
    app.get("/gallery", gallery_controller_1.galleryController.list);
    app.get("/gallery/:id", gallery_controller_1.galleryController.getById);
    app.post("/gallery", gallery_controller_1.galleryController.create);
    app.put("/gallery/:id", gallery_controller_1.galleryController.update);
    app.delete("/gallery/:id", gallery_controller_1.galleryController.remove);
}
