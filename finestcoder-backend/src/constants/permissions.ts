export const MODULES = ["courses", "blogs", "gallery", "enquiries", "testimonials"] as const;
export const OPERATIONS = ["create", "read", "update", "delete", "custom"] as const;

export type PermissionModule = (typeof MODULES)[number];
export type PermissionOperation = (typeof OPERATIONS)[number];
export type PermCode = `${PermissionModule}:${PermissionOperation}`;
