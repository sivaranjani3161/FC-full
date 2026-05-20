export const MODULE_OPS: Record<string, Array<{ key: string; label: string }>> = {
  courses: [
    { key: "create", label: "Create" },
    { key: "read", label: "View" },
    { key: "update", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "publish", label: "Publish" },
  ],
  blogs: [
    { key: "create", label: "Create" },
    { key: "read", label: "View" },
    { key: "update", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "publish", label: "Publish" },
  ],
  gallery: [
    { key: "create", label: "Create" },
    { key: "read", label: "View" },
    { key: "update", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "upload", label: "Upload Images" },
  ],
  enquiries: [
    { key: "read", label: "View" },
    { key: "update", label: "Update Status" },
    { key: "delete", label: "Delete" },
  ],
  testimonials: [
    { key: "create", label: "Create" },
    { key: "read", label: "View" },
    { key: "update", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "publish", label: "Publish" },
  ],
};

export const PERMISSION_MODULES = [
  { key: "courses", label: "Courses" },
  { key: "blogs", label: "Blogs" },
  { key: "gallery", label: "Gallery" },
  { key: "enquiries", label: "Enquiries" },
  { key: "testimonials", label: "Testimonials" },
] as const;

export const ALL_OP_KEYS = [
  "create",
  "read",
  "update",
  "delete",
  "publish",
  "upload",
  "custom",
] as const;
