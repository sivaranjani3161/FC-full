import { apiRequest } from "@/lib/api-client";
import type { DbRole } from "@/types/role";
import type { PermissionMap } from "@/types/permissions";

export const roleService = {
  list: () => apiRequest<DbRole[]>("/roles"),

  create: (payload: { name: string; code: string; description?: string | null }) =>
    apiRequest<DbRole>("/roles", { method: "POST", body: payload }),

  update: (id: number, payload: { description?: string | null }) =>
    apiRequest<DbRole>(`/roles/${id}`, { method: "PUT", body: payload }),

  remove: (id: number) =>
    apiRequest<{ success: boolean }>(`/roles/${id}`, { method: "DELETE" }),

  getPermissions: (roleId: number) =>
    apiRequest<PermissionMap>(`/permissions?roleId=${roleId}`),

  savePermissions: (roleId: number, permissions: PermissionMap) =>
    apiRequest<{ success: boolean; inserted: number }>("/permissions", {
      method: "PUT",
      body: { roleId, permissions },
    }),
};
