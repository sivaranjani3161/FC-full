import { AppDataSource } from "../config/data-source";
import { CourseCategory } from "../entities/CourseCategory";
import { slugFromName } from "../utils/slug";
import { HttpError } from "../utils/http";
import type { z } from "zod";
import type { createCourseCategorySchema, updateCourseCategorySchema } from "../schemas/courseCategory.schema";

type CreateInput = z.infer<typeof createCourseCategorySchema>;
type UpdateInput = z.infer<typeof updateCourseCategorySchema>;

export class CourseCategoryService {
  private repo = AppDataSource.getRepository(CourseCategory);

  async list() {
    return this.repo.find({ order: { sortOrder: "ASC", name: "ASC" } });
  }

  async listWithCourses() {
    const cats = await this.repo.find({
      order: { sortOrder: "ASC", name: "ASC" },
      relations: ["courses"],
    });
    return cats.map((cat) => ({
      ...cat,
      courses: (cat.courses || [])
        .filter((c) => c.isActive)
        .map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
    }));
  }

  async create(input: CreateInput) {
    const slug = input.slug?.trim() || slugFromName(input.name);
    const existing = await this.repo.findOne({ where: { slug } });
    if (existing) throw new HttpError("Category with this slug already exists", 400);

    const cat = this.repo.create({
      name: input.name.trim(),
      slug,
      description: input.description ?? null,
      sortOrder: input.sortOrder ?? 0,
    });
    return this.repo.save(cat);
  }

  async update(id: number, input: UpdateInput) {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new HttpError("Category not found", 404);

    if (input.name !== undefined) cat.name = input.name.trim();
    if (input.slug !== undefined) cat.slug = input.slug.trim();
    if (input.description !== undefined) cat.description = input.description ?? null;
    if (input.sortOrder !== undefined) cat.sortOrder = input.sortOrder;

    return this.repo.save(cat);
  }

  async remove(id: number) {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new HttpError("Category not found", 404);
    await this.repo.remove(cat);
    return { success: true as const };
  }
}

export const courseCategoryService = new CourseCategoryService();
