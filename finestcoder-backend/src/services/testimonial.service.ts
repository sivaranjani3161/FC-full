import { AppDataSource } from "../config/data-source";
import { Testimonial } from "../entities/Testimonial";
import { TestimonialType } from "../entities/enums/TestimonialType";
import { HttpError } from "../utils/http";
import type { z } from "zod";
import type { createTestimonialSchema, updateTestimonialSchema } from "../schemas/testimonial.schema";

type CreateInput = z.infer<typeof createTestimonialSchema>;
type UpdateInput = z.infer<typeof updateTestimonialSchema>;

export class TestimonialService {
  private repo = AppDataSource.getRepository(Testimonial);

  private validateTypeRules(type: TestimonialType, name: string, videoUrl: string) {
    if (type === TestimonialType.VIDEO) {
      if (!videoUrl.trim()) throw new HttpError("videoUrl is required for video testimonials", 400);
      return name.trim() || "Video";
    }
    if (!name.trim()) throw new HttpError("name is required for text testimonials", 400);
    return name.trim();
  }

  private async nextSortOrder() {
    const maxRow = await this.repo
      .createQueryBuilder("t")
      .select("COALESCE(MAX(t.sortOrder), -1)", "maxSort")
      .getRawOne<{ maxSort: string }>();
    return Number(maxRow?.maxSort ?? -1) + 1;
  }

  async list() {
    return this.repo.find({ order: { sortOrder: "ASC", createdAt: "DESC" } });
  }

  async getById(id: number) {
    const testimonial = await this.repo.findOne({ where: { id } });
    if (!testimonial) throw new HttpError("Testimonial not found", 404);
    return testimonial;
  }

  async create(input: CreateInput) {
    const type = input.type ?? TestimonialType.TEXT;
    const videoUrl = (input.videoUrl ?? "").trim();
    const name = this.validateTypeRules(type, input.name ?? "", videoUrl);

    const testimonial = this.repo.create({
      type,
      videoUrl: type === TestimonialType.VIDEO ? videoUrl : null,
      thumbnailUrl: input.thumbnailUrl?.trim() || null,
      name,
      role: input.role ?? null,
      company: input.company ?? null,
      title: input.title ?? null,
      description: input.description ?? null,
      isActive: input.isActive ?? true,
      sortOrder: await this.nextSortOrder(),
      createdBy: input.createdBy,
    });
    return this.repo.save(testimonial);
  }

  async update(id: number, input: UpdateInput) {
    const testimonial = await this.repo.findOne({ where: { id } });
    if (!testimonial) throw new HttpError("Testimonial not found", 404);

    if (input.type !== undefined) testimonial.type = input.type;
    if (input.name !== undefined) {
      testimonial.name = this.validateTypeRules(
        testimonial.type,
        input.name,
        input.videoUrl ?? testimonial.videoUrl ?? ""
      );
    } else if (testimonial.type === TestimonialType.VIDEO && !testimonial.name?.trim()) {
      testimonial.name = "Video";
    }

    if (input.videoUrl !== undefined) testimonial.videoUrl = input.videoUrl?.trim() || null;
    if (input.thumbnailUrl !== undefined) testimonial.thumbnailUrl = input.thumbnailUrl?.trim() || null;
    if (input.role !== undefined) testimonial.role = input.role ?? null;
    if (input.company !== undefined) testimonial.company = input.company ?? null;
    if (input.title !== undefined) testimonial.title = input.title ?? null;
    if (input.description !== undefined) testimonial.description = input.description ?? null;
    if (input.isActive !== undefined) testimonial.isActive = input.isActive;

    if (testimonial.type === TestimonialType.TEXT) testimonial.videoUrl = null;

    this.validateTypeRules(
      testimonial.type,
      testimonial.name ?? "",
      testimonial.videoUrl ?? ""
    );

    return this.repo.save(testimonial);
  }

  async remove(id: number) {
    const testimonial = await this.repo.findOne({ where: { id } });
    if (!testimonial) throw new HttpError("Testimonial not found", 404);
    await this.repo.remove(testimonial);
    return { success: true as const };
  }
}

export const testimonialService = new TestimonialService();
