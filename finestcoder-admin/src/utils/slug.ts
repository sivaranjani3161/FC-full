/** URL-safe slug from arbitrary text */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Slug from display name (e.g. category or course title) */
export function slugFromName(name: string): string {
  return slugify(name);
}

/** Role code slug (same rules as backend) */
export function slugifyRoleCode(name: string): string {
  return slugFromName(name);
}
