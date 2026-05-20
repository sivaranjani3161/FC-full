"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTagName = normalizeTagName;
exports.slugFromTagName = slugFromTagName;
const slug_1 = require("./slug");
function normalizeTagName(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function slugFromTagName(name) {
    return (0, slug_1.slugify)(name);
}
