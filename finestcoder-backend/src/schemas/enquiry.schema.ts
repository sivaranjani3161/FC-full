import { z } from "zod";
import { EnquiryStatus } from "../entities/enums/EnquiryStatus";

export const createEnquirySchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  courseId: z.coerce.number().int().positive().nullable().optional(),
  status: z.nativeEnum(EnquiryStatus).default(EnquiryStatus.NEW),
});

export const updateEnquirySchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  courseId: z.coerce.number().int().positive().nullable().optional(),
  status: z.nativeEnum(EnquiryStatus).optional(),
});
