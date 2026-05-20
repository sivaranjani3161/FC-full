/** @deprecated Import from `@/types/auth` instead */
export type { AuthRole as Role, SessionUser as ExtendedUser } from './auth';
export type {
  Module,
  CrudOperation,
  ModulePermissions,
  RolePermissions,
} from './auth';

/** @deprecated Legacy config shape — permissions are DB-driven via JWT */
export type PermissionsConfig = {
  roles: import('./auth').AuthRole[];
  modules: import('./auth').Module[];
  roleRoutes: Record<string, string>;
  userRoles: Record<string, string>;
  permissions: Record<string, import('./auth').RolePermissions>;
};
