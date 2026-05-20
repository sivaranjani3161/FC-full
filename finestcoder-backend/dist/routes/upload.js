"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploadRoutes;
const upload_controller_1 = require("../controllers/upload.controller");
async function uploadRoutes(app) {
    app.post("/upload", upload_controller_1.uploadController.upload);
}
