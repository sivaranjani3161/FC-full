"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATIONS = exports.MODULES = void 0;
exports.default = permissionRoutes;
const permission_controller_1 = require("../controllers/permission.controller");
var permissions_1 = require("../constants/permissions");
Object.defineProperty(exports, "MODULES", { enumerable: true, get: function () { return permissions_1.MODULES; } });
Object.defineProperty(exports, "OPERATIONS", { enumerable: true, get: function () { return permissions_1.OPERATIONS; } });
async function permissionRoutes(app) {
    app.get("/permissions", permission_controller_1.permissionController.getByRole);
    app.put("/permissions", permission_controller_1.permissionController.replace);
    app.get("/permissions/all", permission_controller_1.permissionController.getAll);
}
