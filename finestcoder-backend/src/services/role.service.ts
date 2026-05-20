import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Permission } from "../entities/Permission";
import { HttpError } from "../utils/http";
import type { z } from "zod";
import type { createRoleSchema, updateRoleSchema } from "../schemas/role.schema";

type CreateInput = z.infer<typeof createRoleSchema>;
type UpdateInput = z.infer<typeof updateRoleSchema>;

export class RoleService {
  private roleRepo = AppDataSource.getRepository(Role);
  private userRepo = AppDataSource.getRepository(User);
  private permRepo = AppDataSource.getRepository(Permission);

  async list() {
    return this.roleRepo.find({ order: { id: "ASC" } });
  }

  async create(input: CreateInput) {
    const role = this.roleRepo.create({
      name: input.name,
      code: input.code,
      description: input.description ?? null,
    });
    return this.roleRepo.save(role);
  }

  async update(id: number, input: UpdateInput) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new HttpError("Role not found", 404);
    if (role.code === "admin") throw new HttpError("Admin role cannot be edited", 400);

    if (input.description !== undefined) role.description = input.description ?? null;
    try {
      return await this.roleRepo.save(role);
    } catch (error: unknown) {
      if ((error as { code?: string })?.code === "ER_DUP_ENTRY") {
        throw new HttpError("Role code already exists", 409);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new HttpError("Role not found", 404);
    if (role.code === "admin") throw new HttpError("Admin role cannot be deleted", 400);

    const adminRole = await this.roleRepo.findOne({ where: { code: "admin" } });
    if (adminRole) {
      await this.userRepo.update({ roleId: id }, { roleId: adminRole.id });
    }

    await this.permRepo.delete({ roleId: id });
    await this.roleRepo.delete(id);
    return { success: true as const };
  }
}

export const roleService = new RoleService();
