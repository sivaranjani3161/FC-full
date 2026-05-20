"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = enquiryRoutes;
const enquiry_controller_1 = require("../controllers/enquiry.controller");
async function enquiryRoutes(app) {
    app.get("/enquiries", enquiry_controller_1.enquiryController.list);
    app.get("/enquiries/:id", enquiry_controller_1.enquiryController.getById);
    app.post("/enquiries", enquiry_controller_1.enquiryController.create);
    app.put("/enquiries/:id", enquiry_controller_1.enquiryController.update);
    app.delete("/enquiries/:id", enquiry_controller_1.enquiryController.remove);
}
