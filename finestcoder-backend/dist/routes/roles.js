"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roleRoutes;
const role_controller_1 = require("../controllers/role.controller");
async function roleRoutes(app) {
    app.get("/roles", role_controller_1.roleController.list);
    app.post("/roles", role_controller_1.roleController.create);
    app.put("/roles/:id", role_controller_1.roleController.update);
    app.delete("/roles/:id", role_controller_1.roleController.remove);
}
