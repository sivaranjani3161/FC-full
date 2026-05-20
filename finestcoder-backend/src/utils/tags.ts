import { slugify } from "./slug";

export function normalizeTagName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function slugFromTagName(name: string): string {
  return slugify(name);
}
