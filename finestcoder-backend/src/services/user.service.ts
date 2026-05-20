import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { UserStatus } from "../entities/enums/UserStatus";
import { HttpError } from "../utils/http";
import { normalizeEmail } from "../utils/string";
import type { z } from "zod";
import type { createUserSchema, updateUserSchema } from "../schemas/user.schema";

type CreateInput = z.infer<typeof createUserSchema>;
type UpdateInput = z.infer<typeof updateUserSchema>;

const userSelect = {
  id: true,
  email: true,
  name: true,
  status: true,
  authProvider: true,
  roleId: true,
  createdAt: true,
  role: { id: true, name: true, code: true },
} as const;

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  async list() {
    return this.userRepo.find({
      relations: ["role"],
      order: { createdAt: "DESC" },
      select: userSelect,
    });
  }

  async getByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ["role", "role.permissions"],
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        roleId: true,
        role: {
          id: true,
          name: true,
          code: true,
          permissions: { id: true, code: true, name: true },
        },
      },
    });
    if (!user) throw new HttpError("User not found", 404);
    return user;
  }

  async create(input: CreateInput) {
    const email = normalizeEmail(input.email);
    const name = input.name.trim();

    const role = await this.roleRepo.findOne({ where: { id: input.roleId } });
    if (!role) throw new HttpError("Role not found", 400);

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new HttpError("User already exists", 409);

    const user = this.userRepo.create({
      email,
      name,
      roleId: input.roleId,
      status: UserStatus.ACTIVE,
      authProvider: "google",
      password: null,
      oauthId: null,
      inviteToken: null,
      inviteExpiresAt: null,
    });
    const saved = await this.userRepo.save(user);
    return { ...saved, role };
  }

  async update(id: number, input: UpdateInput) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new HttpError("User not found", 404);

    if (input.roleId !== undefined) {
      const role = await this.roleRepo.findOne({ where: { id: input.roleId } });
      if (!role) throw new HttpError("Role not found", 400);
      user.roleId = input.roleId;
    }

    if (input.name !== undefined) user.name = input.name.trim();
    if (input.email !== undefined) {
      const email = normalizeEmail(input.email);
      const existing = await this.userRepo.findOne({ where: { email } });
      if (existing && existing.id !== id) throw new HttpError("Email already in use", 409);
      user.email = email;
    }
    if (input.status !== undefined) user.status = input.status;

    await this.userRepo.save(user);
    const withRole = await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
      select: userSelect,
    });
    return withRole;
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new HttpError("User not found", 404);
  }
}

export const userService = new UserService();
