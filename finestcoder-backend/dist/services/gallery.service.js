"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryService = exports.GalleryService = void 0;
const data_source_1 = require("../config/data-source");
const GalleryEvent_1 = require("../entities/GalleryEvent");
const GalleryImage_1 = require("../entities/GalleryImage");
const http_1 = require("../utils/http");
class GalleryService {
    eventRepo = data_source_1.AppDataSource.getRepository(GalleryEvent_1.GalleryEvent);
    imageRepo = data_source_1.AppDataSource.getRepository(GalleryImage_1.GalleryImage);
    mapImages(images) {
        return images
            .map((item) => ({
            id: item.id,
            imageUrl: item.imageUrl.trim(),
            altText: item.altText ?? null,
        }))
            .filter((item) => item.imageUrl.length > 0);
    }
    async list(type) {
        const where = type ? { type } : {};
        return this.eventRepo.find({
            where,
            relations: ["galleryImages"],
            order: { createdAt: "DESC", galleryImages: { createdAt: "ASC", id: "ASC" } },
        });
    }
    async getById(id) {
        const event = await this.eventRepo.findOne({
            where: { id },
            relations: ["galleryImages"],
            order: { galleryImages: { createdAt: "ASC", id: "ASC" } },
        });
        if (!event)
            throw new http_1.HttpError("Gallery event not found", 404);
        return event;
    }
    async create(body) {
        if (body.type === "internal") {
            return this.createInternal(body);
        }
        return this.createExternal(body);
    }
    async createExternal(input) {
        const slugExists = await this.eventRepo.findOne({ where: { slug: input.slug } });
        if (slugExists)
            throw new http_1.HttpError("Slug already exists", 409);
        const event = this.eventRepo.create({
            type: "external",
            title: input.title,
            slug: input.slug,
            location: input.location ?? null,
            coverImage: input.coverImage ?? null,
            description: input.description ?? null,
            eventDate: input.eventDate ?? null,
            createdBy: input.createdBy,
        });
        const saved = await this.eventRepo.save(event);
        const images = this.mapImages(input.galleryImages ?? []);
        if (images.length) {
            await this.imageRepo.save(images.map((item) => ({ ...item, eventId: saved.id })));
        }
        return this.getById(saved.id);
    }
    async createInternal(input) {
        const event = this.eventRepo.create({
            type: "internal",
            title: null,
            slug: null,
            createdBy: null,
        });
        const saved = await this.eventRepo.save(event);
        await this.imageRepo.save({
            imageUrl: input.imageUrl,
            altText: input.altText ?? null,
            eventId: saved.id,
        });
        return this.getById(saved.id);
    }
    async update(id, body) {
        const event = await this.eventRepo.findOne({ where: { id }, relations: ["galleryImages"] });
        if (!event)
            throw new http_1.HttpError("Gallery event not found", 404);
        if (event.type === "external") {
            await this.updateExternal(event, body);
        }
        else {
            await this.updateInternal(event.id, body);
        }
        return this.getById(event.id);
    }
    async updateExternal(event, input) {
        const nextSlug = input.slug !== undefined ? input.slug : event.slug;
        if (!nextSlug)
            throw new http_1.HttpError("slug is required", 400);
        if (nextSlug !== event.slug) {
            const slugExists = await this.eventRepo.findOne({ where: { slug: nextSlug } });
            if (slugExists && slugExists.id !== event.id)
                throw new http_1.HttpError("Slug already exists", 409);
        }
        if (input.title !== undefined)
            event.title = input.title;
        event.slug = nextSlug;
        if (input.location !== undefined)
            event.location = input.location ?? null;
        if (input.coverImage !== undefined)
            event.coverImage = input.coverImage ?? null;
        if (input.description !== undefined)
            event.description = input.description ?? null;
        if (input.eventDate !== undefined)
            event.eventDate = input.eventDate ?? null;
        await this.eventRepo.save(event);
        if (input.galleryImages !== undefined) {
            await this.imageRepo.delete({ eventId: event.id });
            const images = this.mapImages(input.galleryImages);
            if (images.length) {
                await this.imageRepo.save(images.map((item) => ({ ...item, eventId: event.id })));
            }
        }
    }
    async updateInternal(eventId, input) {
        if (input.imageUrl === undefined && input.altText === undefined)
            return;
        await this.imageRepo.delete({ eventId });
        const imageUrl = (input.imageUrl ?? "").trim();
        if (imageUrl) {
            await this.imageRepo.save({
                imageUrl,
                altText: input.altText ?? null,
                eventId,
            });
        }
    }
    async remove(id) {
        const event = await this.eventRepo.findOne({ where: { id } });
        if (!event)
            throw new http_1.HttpError("Gallery event not found", 404);
        await this.eventRepo.remove(event);
        return { success: true };
    }
}
exports.GalleryService = GalleryService;
exports.galleryService = new GalleryService();
