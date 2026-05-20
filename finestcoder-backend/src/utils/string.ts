export function normalizeTagName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function trimString(value: unknown, fallback = ""): string {
  return String(value ?? fallback).trim();
}

export function normalizeEmail(value: unknown): string {
  return trimString(value).toLowerCase();
}
