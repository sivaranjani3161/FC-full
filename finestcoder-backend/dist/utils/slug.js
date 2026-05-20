"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugFromName = void 0;
exports.slugify = slugify;
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}
exports.slugFromName = slugify;
