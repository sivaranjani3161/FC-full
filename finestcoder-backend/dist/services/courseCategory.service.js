"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseCategoryService = exports.CourseCategoryService = void 0;
const data_source_1 = require("../config/data-source");
const CourseCategory_1 = require("../entities/CourseCategory");
const slug_1 = require("../utils/slug");
const http_1 = require("../utils/http");
class CourseCategoryService {
    repo = data_source_1.AppDataSource.getRepository(CourseCategory_1.CourseCategory);
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
    async create(input) {
        const slug = input.slug?.trim() || (0, slug_1.slugFromName)(input.name);
        const existing = await this.repo.findOne({ where: { slug } });
        if (existing)
            throw new http_1.HttpError("Category with this slug already exists", 400);
        const cat = this.repo.create({
            name: input.name.trim(),
            slug,
            description: input.description ?? null,
            sortOrder: input.sortOrder ?? 0,
        });
        return this.repo.save(cat);
    }
    async update(id, input) {
        const cat = await this.repo.findOne({ where: { id } });
        if (!cat)
            throw new http_1.HttpError("Category not found", 404);
        if (input.name !== undefined)
            cat.name = input.name.trim();
        if (input.slug !== undefined)
            cat.slug = input.slug.trim();
        if (input.description !== undefined)
            cat.description = input.description ?? null;
        if (input.sortOrder !== undefined)
            cat.sortOrder = input.sortOrder;
        return this.repo.save(cat);
    }
    async remove(id) {
        const cat = await this.repo.findOne({ where: { id } });
        if (!cat)
            throw new http_1.HttpError("Category not found", 404);
        await this.repo.remove(cat);
        return { success: true };
    }
}
exports.CourseCategoryService = CourseCategoryService;
exports.courseCategoryService = new CourseCategoryService();
