"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const upload_service_1 = require("../services/upload.service");
const http_1 = require("../utils/http");
exports.uploadController = {
    async upload(req, reply) {
        try {
            const data = await req.file();
            if (!data)
                return (0, http_1.sendError)(reply, 400, "No file uploaded");
            const result = await upload_service_1.uploadService.saveFromStream(data.file, data.filename);
            return reply.send(result);
        }
        catch (error) {
            return (0, http_1.handleControllerError)(reply, error, "Failed to upload file");
        }
    },
};
