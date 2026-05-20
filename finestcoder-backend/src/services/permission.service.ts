import { AppDataSource } from "../config/data-source";
import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";
import { MODULES, OPERATIONS } from "../constants/permissions";
import { HttpError } from "../utils/http";
import type { z } from "zod";
import type { updatePermissionsSchema } from "../schemas/permission.schema";

type UpdateInput = z.infer<typeof updatePermissionsSchema>;

function buildPermissionMap(perms: { code: string }[]) {
  const result: Record<string, Record<string, boolean>> = {};
  for (const mod of MODULES) {
    result[mod] = {};
    for (const op of OPERATIONS) {
      const code = `${mod}:${op}`;
      result[mod][op] = perms.some((p) => p.code === code);
    }
  }
  return result;
}

export class PermissionService {
  private permRepo = AppDataSource.getRepository(Permission);
  private roleRepo = AppDataSource.getRepository(Role);

  async getByRole(roleId: number) {
    const perms = await this.permRepo.find({ where: { roleId } });
    return buildPermissionMap(perms);
  }

  async replaceForRole(input: UpdateInput) {
    const role = await this.roleRepo.findOne({ where: { id: input.roleId } });
    if (!role) throw new HttpError("Role not found", 400);

    await this.permRepo.delete({ roleId: input.roleId });

    const toInsert: Partial<Permission>[] = [];
    for (const mod of MODULES) {
      for (const op of OPERATIONS) {
        if (input.permissions?.[mod]?.[op]) {
          const code = `${mod}:${op}`;
          toInsert.push({
            roleId: input.roleId,
            code,
            name: `${mod} ${op}`,
            description: null,
          });
        }
      }
    }

    if (toInsert.length > 0) {
      await this.permRepo.save(this.permRepo.create(toInsert as Permission[]));
    }

    return { success: true as const, inserted: toInsert.length };
  }

  async getAllGrouped() {
    const roles = await this.roleRepo.find({ relations: ["permissions"] });
    return roles.map((role) => ({
      roleId: role.id,
      roleCode: role.code,
      roleName: role.name,
      permissions: buildPermissionMap(role.permissions),
    }));
  }
}

export const permissionService = new PermissionService();
