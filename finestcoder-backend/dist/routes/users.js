"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = require("../controllers/user.controller");
async function userRoutes(app) {
    app.get("/users", user_controller_1.userController.list);
    app.get("/users/by-email/:email", user_controller_1.userController.getByEmail);
    app.post("/users", user_controller_1.userController.create);
    app.put("/users/:id", user_controller_1.userController.update);
    app.delete("/users/:id", user_controller_1.userController.remove);
}
