import { AppDataSource } from "../config/data-source";
import { GalleryEvent } from "../entities/GalleryEvent";
import { GalleryImage } from "../entities/GalleryImage";
import { HttpError } from "../utils/http";
import type { z } from "zod";
import type {
  createExternalGallerySchema,
  createInternalGallerySchema,
  galleryImageSchema,
  updateExternalGallerySchema,
  updateInternalGallerySchema,
} from "../schemas/gallery.schema";

type ExternalCreate = z.infer<typeof createExternalGallerySchema>;
type InternalCreate = z.infer<typeof createInternalGallerySchema>;
type GalleryImageInput = z.infer<typeof galleryImageSchema>;
type ExternalUpdate = z.infer<typeof updateExternalGallerySchema>;
type InternalUpdate = z.infer<typeof updateInternalGallerySchema>;

export class GalleryService {
  private eventRepo = AppDataSource.getRepository(GalleryEvent);
  private imageRepo = AppDataSource.getRepository(GalleryImage);

  private mapImages(images: GalleryImageInput[]) {
    return images
      .map((item) => ({
        id: item.id,
        imageUrl: item.imageUrl.trim(),
        altText: item.altText ?? null,
      }))
      .filter((item) => item.imageUrl.length > 0);
  }

  async list(type?: "internal" | "external") {
    const where = type ? { type } : {};
    return this.eventRepo.find({
      where,
      relations: ["galleryImages"],
      order: { createdAt: "DESC", galleryImages: { createdAt: "ASC", id: "ASC" } },
    });
  }

  async getById(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ["galleryImages"],
      order: { galleryImages: { createdAt: "ASC", id: "ASC" } },
    });
    if (!event) throw new HttpError("Gallery event not found", 404);
    return event;
  }

  async create(body: ExternalCreate | InternalCreate) {
    if (body.type === "internal") {
      return this.createInternal(body);
    }
    return this.createExternal(body as ExternalCreate);
  }

  private async createExternal(input: ExternalCreate) {
    const slugExists = await this.eventRepo.findOne({ where: { slug: input.slug } });
    if (slugExists) throw new HttpError("Slug already exists", 409);

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

  private async createInternal(input: InternalCreate) {
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

  async update(id: number, body: ExternalUpdate | InternalUpdate & { type?: string }) {
    const event = await this.eventRepo.findOne({ where: { id }, relations: ["galleryImages"] });
    if (!event) throw new HttpError("Gallery event not found", 404);

    if (event.type === "external") {
      await this.updateExternal(event, body as ExternalUpdate);
    } else {
      await this.updateInternal(event.id, body as InternalUpdate);
    }

    return this.getById(event.id);
  }

  private async updateExternal(event: GalleryEvent, input: ExternalUpdate) {
    const nextSlug = input.slug !== undefined ? input.slug : event.slug;
    if (!nextSlug) throw new HttpError("slug is required", 400);
    if (nextSlug !== event.slug) {
      const slugExists = await this.eventRepo.findOne({ where: { slug: nextSlug } });
      if (slugExists && slugExists.id !== event.id) throw new HttpError("Slug already exists", 409);
    }

    if (input.title !== undefined) event.title = input.title;
    event.slug = nextSlug;
    if (input.location !== undefined) event.location = input.location ?? null;
    if (input.coverImage !== undefined) event.coverImage = input.coverImage ?? null;
    if (input.description !== undefined) event.description = input.description ?? null;
    if (input.eventDate !== undefined) event.eventDate = input.eventDate ?? null;
    await this.eventRepo.save(event);

    if (input.galleryImages !== undefined) {
      await this.imageRepo.delete({ eventId: event.id });
      const images = this.mapImages(input.galleryImages);
      if (images.length) {
        await this.imageRepo.save(images.map((item) => ({ ...item, eventId: event.id })));
      }
    }
  }

  private async updateInternal(eventId: number, input: InternalUpdate) {
    if (input.imageUrl === undefined && input.altText === undefined) return;
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

  async remove(id: number) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new HttpError("Gallery event not found", 404);
    await this.eventRepo.remove(event);
    return { success: true as const };
  }
}

export const galleryService = new GalleryService();
