"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.sendError = sendError;
exports.handleControllerError = handleControllerError;
const validation_1 = require("./validation");
function sendError(reply, status, message) {
    return reply.status(status).send({ error: message });
}
function handleControllerError(reply, error, fallback = "Internal server error") {
    if (error instanceof validation_1.ValidationError) {
        return sendError(reply, error.statusCode, error.message);
    }
    if (error instanceof Error && "statusCode" in error) {
        const code = error.statusCode;
        return sendError(reply, code, error.message);
    }
    return sendError(reply, 500, fallback);
}
class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
    }
}
exports.HttpError = HttpError;
