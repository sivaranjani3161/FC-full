import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().nullable().optional(),
});

export const updateRoleSchema = z.object({
  description: z.string().nullable().optional(),
});
