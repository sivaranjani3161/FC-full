export type AuthRole = 'admin' | 'editor' | 'viewer';

export type Module =
  | 'courses'
  | 'blogs'
  | 'gallery'
  | 'enquiries'
  | 'testimonials';

export type CrudOperation = 'create' | 'read' | 'update' | 'delete' | 'custom';

export type ModulePermissions = {
  [key in CrudOperation]: boolean;
};

export type RolePermissions = {
  [module in Module]: ModulePermissions;
};

export type PermissionsMap = Record<string, Record<string, boolean>>;

export type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  roleId?: number;
  roleName?: string;
  dbUserId?: number;
  permissions?: PermissionsMap;
};
