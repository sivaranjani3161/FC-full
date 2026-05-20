import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import { CourseHighlight } from "../entities/CourseHighlight";
import { CourseStructure } from "../entities/CourseStructure";
import { CourseFeature } from "../entities/CourseFeature";
import { HttpError } from "../utils/http";
import type { z } from "zod";
import type { createCourseSchema, nestedCourseItemSchema, updateCourseSchema } from "../schemas/course.schema";

type CreateInput = z.infer<typeof createCourseSchema>;
type UpdateInput = z.infer<typeof updateCourseSchema>;
type NestedItem = z.infer<typeof nestedCourseItemSchema>;
type NestedCoursePayload = {
  title: string;
  description: string[];
  icon: string | null;
  phaseNumber?: number;
  sortOrder: number;
};

export class CourseService {
  private courseRepo = AppDataSource.getRepository(Course);
  private highlightRepo = AppDataSource.getRepository(CourseHighlight);
  private structureRepo = AppDataSource.getRepository(CourseStructure);
  private featureRepo = AppDataSource.getRepository(CourseFeature);

  private mapNestedItems(arr: NestedItem[]): NestedCoursePayload[] {
    return arr
      .map((item) => ({
        title: item.title.trim(),
        description: item.description ?? [],
        icon: item.icon ?? null,
        phaseNumber: item.phaseNumber,
        sortOrder: item.sortOrder ?? 0,
      }))
      .filter((item) => item.title.length > 0);
  }

  async list() {
    return this.courseRepo.find({ order: { createdAt: "DESC" } });
  }

  async listActive() {
    return this.courseRepo.find({
      where: { isActive: true },
      select: ["id", "title", "slug", "description", "heroImage"],
      order: { createdAt: "ASC" },
    });
  }

  async getBySlug(slug: string) {
    const course = await this.courseRepo.findOne({
      where: { slug, isActive: true },
      relations: ["courseHighlights", "courseStructure", "courseFeatures"],
    });
    if (!course) throw new HttpError("Course not found", 404);

    course.courseHighlights.sort((a, b) => a.sortOrder - b.sortOrder);
    course.courseStructure.sort((a, b) => a.sortOrder - b.sortOrder);
    course.courseFeatures.sort((a, b) => a.sortOrder - b.sortOrder);
    return course;
  }

  async getById(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ["courseHighlights", "courseStructure", "courseFeatures"],
    });
    if (!course) throw new HttpError("Course not found", 404);
    return course;
  }

  async create(input: CreateInput) {
    const existing = await this.courseRepo.findOne({ where: { slug: input.slug } });
    if (existing) throw new HttpError("Slug already exists", 400);

    const course = this.courseRepo.create({
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      heroImage: input.heroImage ?? null,
      isActive: input.isActive ?? true,
      categoryId: input.categoryId ?? null,
      createdBy: input.createdBy,
      courseHighlights: this.mapNestedItems(input.courseHighlights ?? []) as unknown as CourseHighlight[],
      courseFeatures: this.mapNestedItems(input.courseFeatures ?? []) as unknown as CourseFeature[],
      courseStructure: this.mapNestedItems(input.courseStructure ?? []) as unknown as CourseStructure[],
    });
    return this.courseRepo.save(course);
  }

  async update(id: number, input: UpdateInput) {
    const existing = await this.courseRepo.findOne({ where: { id } });
    if (!existing) throw new HttpError("Course not found", 404);

    const updatePayload: Partial<Course> = {};
    if (input.title !== undefined) updatePayload.title = input.title;
    if (input.description !== undefined) updatePayload.description = input.description ?? null;
    if (input.heroImage !== undefined) updatePayload.heroImage = input.heroImage ?? null;
    if (input.isActive !== undefined) updatePayload.isActive = input.isActive;
    if (input.categoryId !== undefined) updatePayload.categoryId = input.categoryId ?? null;

    if (input.slug !== undefined && input.slug !== existing.slug) {
      const conflict = await this.courseRepo.findOne({ where: { slug: input.slug } });
      if (conflict && conflict.id !== id) throw new HttpError("Slug already exists", 400);
      updatePayload.slug = input.slug;
    }

    if (Object.keys(updatePayload).length > 0) {
      await this.courseRepo.update(id, updatePayload);
    }

    await this.highlightRepo.delete({ courseId: id });
    await this.structureRepo.delete({ courseId: id });
    await this.featureRepo.delete({ courseId: id });

    const highlights = this.mapNestedItems(input.courseHighlights ?? []);
    if (highlights.length > 0) {
      await this.highlightRepo.save(
        highlights.map((item) => this.highlightRepo.create({ ...item, courseId: id }))
      );
    }

    const structures = this.mapNestedItems(input.courseStructure ?? []);
    if (structures.length > 0) {
      await this.structureRepo.save(
        structures.map((item) => this.structureRepo.create({ ...item, courseId: id }))
      );
    }

    const features = this.mapNestedItems(input.courseFeatures ?? []);
    if (features.length > 0) {
      await this.featureRepo.save(
        features.map((item) => this.featureRepo.create({ ...item, courseId: id }))
      );
    }

    return this.getById(id);
  }

  async remove(id: number) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new HttpError("Course not found", 404);

    await this.highlightRepo.delete({ courseId: id });
    await this.structureRepo.delete({ courseId: id });
    await this.featureRepo.delete({ courseId: id });
    await this.courseRepo.remove(course);
    return { success: true as const };
  }
}

export const courseService = new CourseService();
