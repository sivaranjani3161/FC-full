"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.formatZodError = formatZodError;
exports.parseBody = parseBody;
exports.parseParams = parseParams;
exports.parseQuery = parseQuery;
class ValidationError extends Error {
    statusCode = 400;
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
function formatZodError(error) {
    const fieldErrors = error.flatten().fieldErrors;
    const messages = Object.entries(fieldErrors).flatMap(([key, errs]) => (errs ?? []).map((msg) => `${key}: ${msg}`));
    return messages.length > 0 ? messages.join("; ") : "Validation failed";
}
function parseBody(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(formatZodError(result.error));
    }
    return result.data;
}
function parseParams(schema, data) {
    return parseBody(schema, data);
}
function parseQuery(schema, data) {
    return parseBody(schema, data);
}
