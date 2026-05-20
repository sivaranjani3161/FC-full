import { z } from "zod";
import { UserStatus } from "../entities/enums/UserStatus";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roleId: z.coerce.number().int().positive(),
});

export const updateUserSchema = z.object({
  roleId: z.coerce.number().int().positive().optional(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});
