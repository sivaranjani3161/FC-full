"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTagName = normalizeTagName;
exports.trimString = trimString;
exports.normalizeEmail = normalizeEmail;
function normalizeTagName(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function trimString(value, fallback = "") {
    return String(value ?? fallback).trim();
}
function normalizeEmail(value) {
    return trimString(value).toLowerCase();
}
