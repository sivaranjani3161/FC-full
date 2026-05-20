import { z } from "zod";

export const permissionsQuerySchema = z.object({
  roleId: z.coerce.number().int().positive(),
});

export const updatePermissionsSchema = z.object({
  roleId: z.coerce.number().int().positive(),
  permissions: z.record(z.string(), z.record(z.string(), z.boolean())),
});
