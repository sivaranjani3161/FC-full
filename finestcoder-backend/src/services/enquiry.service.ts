import { AppDataSource } from "../config/data-source";
import { Enquiry } from "../entities/Enquiry";
import { HttpError } from "../utils/http";
import { normalizeEmail } from "../utils/string";
import type { z } from "zod";
import type { createEnquirySchema, updateEnquirySchema } from "../schemas/enquiry.schema";

type CreateInput = z.infer<typeof createEnquirySchema>;
type UpdateInput = z.infer<typeof updateEnquirySchema>;

export class EnquiryService {
  private repo = AppDataSource.getRepository(Enquiry);

  async list() {
    return this.repo.find({
      relations: ["course"],
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number) {
    const enquiry = await this.repo.findOne({ where: { id }, relations: ["course"] });
    if (!enquiry) throw new HttpError("Enquiry not found", 404);
    return enquiry;
  }

  async create(input: CreateInput) {
    const enquiry = this.repo.create({
      fullName: input.fullName.trim(),
      email: normalizeEmail(input.email),
      phone: input.phone ?? null,
      message: input.message ?? null,
      courseId: input.courseId ?? null,
      status: input.status,
    });
    return this.repo.save(enquiry);
  }

  async update(id: number, input: UpdateInput) {
    const enquiry = await this.repo.findOne({ where: { id } });
    if (!enquiry) throw new HttpError("Enquiry not found", 404);

    if (input.fullName !== undefined) enquiry.fullName = input.fullName.trim();
    if (input.email !== undefined) enquiry.email = normalizeEmail(input.email);
    if (input.phone !== undefined) enquiry.phone = input.phone ?? null;
    if (input.message !== undefined) enquiry.message = input.message ?? null;
    if (input.courseId !== undefined) enquiry.courseId = input.courseId ?? null;
    if (input.status !== undefined) enquiry.status = input.status;

    return this.repo.save(enquiry);
  }

  async remove(id: number) {
    const enquiry = await this.repo.findOne({ where: { id } });
    if (!enquiry) throw new HttpError("Enquiry not found", 404);
    await this.repo.remove(enquiry);
    return { success: true as const };
  }
}

export const enquiryService = new EnquiryService();
