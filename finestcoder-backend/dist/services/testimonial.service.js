"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialService = exports.TestimonialService = void 0;
const data_source_1 = require("../config/data-source");
const Testimonial_1 = require("../entities/Testimonial");
const TestimonialType_1 = require("../entities/enums/TestimonialType");
const http_1 = require("../utils/http");
class TestimonialService {
    repo = data_source_1.AppDataSource.getRepository(Testimonial_1.Testimonial);
    validateTypeRules(type, name, videoUrl) {
        if (type === TestimonialType_1.TestimonialType.VIDEO) {
            if (!videoUrl.trim())
                throw new http_1.HttpError("videoUrl is required for video testimonials", 400);
            return name.trim() || "Video";
        }
        if (!name.trim())
            throw new http_1.HttpError("name is required for text testimonials", 400);
        return name.trim();
    }
    async nextSortOrder() {
        const maxRow = await this.repo
            .createQueryBuilder("t")
            .select("COALESCE(MAX(t.sortOrder), -1)", "maxSort")
            .getRawOne();
        return Number(maxRow?.maxSort ?? -1) + 1;
    }
    async list() {
        return this.repo.find({ order: { sortOrder: "ASC", createdAt: "DESC" } });
    }
    async getById(id) {
        const testimonial = await this.repo.findOne({ where: { id } });
        if (!testimonial)
            throw new http_1.HttpError("Testimonial not found", 404);
        return testimonial;
    }
    async create(input) {
        const type = input.type ?? TestimonialType_1.TestimonialType.TEXT;
        const videoUrl = (input.videoUrl ?? "").trim();
        const name = this.validateTypeRules(type, input.name ?? "", videoUrl);
        const testimonial = this.repo.create({
            type,
            videoUrl: type === TestimonialType_1.TestimonialType.VIDEO ? videoUrl : null,
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
    async update(id, input) {
        const testimonial = await this.repo.findOne({ where: { id } });
        if (!testimonial)
            throw new http_1.HttpError("Testimonial not found", 404);
        if (input.type !== undefined)
            testimonial.type = input.type;
        if (input.name !== undefined) {
            testimonial.name = this.validateTypeRules(testimonial.type, input.name, input.videoUrl ?? testimonial.videoUrl ?? "");
        }
        else if (testimonial.type === TestimonialType_1.TestimonialType.VIDEO && !testimonial.name?.trim()) {
            testimonial.name = "Video";
        }
        if (input.videoUrl !== undefined)
            testimonial.videoUrl = input.videoUrl?.trim() || null;
        if (input.thumbnailUrl !== undefined)
            testimonial.thumbnailUrl = input.thumbnailUrl?.trim() || null;
        if (input.role !== undefined)
            testimonial.role = input.role ?? null;
        if (input.company !== undefined)
            testimonial.company = input.company ?? null;
        if (input.title !== undefined)
            testimonial.title = input.title ?? null;
        if (input.description !== undefined)
            testimonial.description = input.description ?? null;
        if (input.isActive !== undefined)
            testimonial.isActive = input.isActive;
        if (testimonial.type === TestimonialType_1.TestimonialType.TEXT)
            testimonial.videoUrl = null;
        this.validateTypeRules(testimonial.type, testimonial.name ?? "", testimonial.videoUrl ?? "");
        return this.repo.save(testimonial);
    }
    async remove(id) {
        const testimonial = await this.repo.findOne({ where: { id } });
        if (!testimonial)
            throw new http_1.HttpError("Testimonial not found", 404);
        await this.repo.remove(testimonial);
        return { success: true };
    }
}
exports.TestimonialService = TestimonialService;
exports.testimonialService = new TestimonialService();
