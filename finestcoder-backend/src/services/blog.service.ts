import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Blog } from "../entities/Blog";
import { BlogTag } from "../entities/BlogTag";
import { RelatedBlog } from "../entities/RelatedBlog";
import { Tag } from "../entities/Tag";
import { BlogStatus } from "../entities/enums/BlogStatus";
import { slugify } from "../utils/slug";
import { normalizeTagName } from "../utils/string";
import { HttpError } from "../utils/http";
import type { createBlogSchema, updateBlogSchema } from "../schemas/blog.schema";
import type { z } from "zod";

type CreateBlogInput = z.infer<typeof createBlogSchema>;
type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

export class BlogService {
  private blogRepo = AppDataSource.getRepository(Blog);
  private blogTagRepo = AppDataSource.getRepository(BlogTag);
  private relatedBlogRepo = AppDataSource.getRepository(RelatedBlog);
  private tagRepo = AppDataSource.getRepository(Tag);

  formatBlog(blog: Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] }) {
    return {
      ...blog,
      tags: blog.blogTags?.map((item) => item.tag?.name).filter(Boolean) ?? [],
      relatedBlogIds: blog.relatedBlogs?.map((item) => item.relatedBlogId) ?? [],
    };
  }

  private async getOrCreateTags(tagNames: string[]) {
    const normalized = Array.from(
      new Set(tagNames.map((name) => normalizeTagName(String(name || ""))).filter(Boolean))
    );
    if (!normalized.length) return [];

    const existing = await this.tagRepo.find({ where: { name: In(normalized) } });
    const map = new Map(existing.map((tag) => [tag.name, tag]));
    const toCreate = normalized.filter((name) => !map.has(name));

    for (const name of toCreate) {
      const created = this.tagRepo.create({ name, slug: slugify(name) });
      const saved = await this.tagRepo.save(created);
      map.set(name, saved);
    }

    return normalized.map((name) => map.get(name)!).filter(Boolean);
  }

  private async syncTagRelations(blogId: number, tagNames: string[]) {
    await this.blogTagRepo.delete({ blogId });
    const tags = await this.getOrCreateTags(tagNames);
    if (!tags.length) return;
    await this.blogTagRepo.save(
      tags.map((tag) => this.blogTagRepo.create({ blogId, tagId: tag.id }))
    );
  }

  private async syncRelatedBlogs(blogId: number, ids: number[]) {
    await this.relatedBlogRepo.delete({ blogId });
    const cleanIds = Array.from(
      new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId))
    );
    if (!cleanIds.length) return;

    const available = await this.blogRepo.find({ where: { id: In(cleanIds) }, select: { id: true } });
    const allowed = new Set(available.map((item) => item.id));
    await this.relatedBlogRepo.save(
      cleanIds
        .filter((id) => allowed.has(id))
        .map((relatedBlogId) => this.relatedBlogRepo.create({ blogId, relatedBlogId }))
    );
  }

  async list() {
    const blogs = await this.blogRepo.find({
      relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
      order: { createdAt: "DESC" },
    });
    return blogs.map((blog) => this.formatBlog(blog as Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] }));
  }

  async getById(id: number) {
    const blog = await this.blogRepo.findOne({
      where: { id },
      relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
    });
    if (!blog) throw new HttpError("Blog not found", 404);
    return this.formatBlog(blog as Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] });
  }

  async create(input: CreateBlogInput) {
    const slugExists = await this.blogRepo.findOne({ where: { slug: input.slug } });
    if (slugExists) throw new HttpError("Slug already exists", 409);

    const blog = this.blogRepo.create({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt ?? null,
      content: input.content ?? "",
      coverImage: input.coverImage ?? null,
      publishedAt: input.publishedAt ?? null,
      status: input.status ?? BlogStatus.DRAFT,
      createdBy: input.createdBy,
    });

    const saved = await this.blogRepo.save(blog);
    await this.syncTagRelations(saved.id, input.tags ?? []);
    await this.syncRelatedBlogs(saved.id, input.relatedBlogIds ?? []);

    const withRelations = await this.blogRepo.findOne({
      where: { id: saved.id },
      relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
    });
    return this.formatBlog(withRelations as Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] });
  }

  async update(id: number, input: UpdateBlogInput) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new HttpError("Blog not found", 404);

    const nextSlug = input.slug !== undefined ? input.slug : blog.slug;
    if (!nextSlug) throw new HttpError("slug is required", 400);
    if (nextSlug !== blog.slug) {
      const slugExists = await this.blogRepo.findOne({ where: { slug: nextSlug } });
      if (slugExists && slugExists.id !== id) {
        throw new HttpError("Slug already exists", 409);
      }
    }

    if (input.title !== undefined) blog.title = input.title;
    blog.slug = nextSlug;
    if (input.excerpt !== undefined) blog.excerpt = input.excerpt ?? null;
    if (input.content !== undefined) blog.content = input.content;
    if (input.coverImage !== undefined) blog.coverImage = input.coverImage ?? null;
    if (input.publishedAt !== undefined) blog.publishedAt = input.publishedAt ?? null;
    if (input.status !== undefined) blog.status = input.status;

    await this.blogRepo.save(blog);
    if (input.tags !== undefined) await this.syncTagRelations(blog.id, input.tags);
    if (input.relatedBlogIds !== undefined) await this.syncRelatedBlogs(blog.id, input.relatedBlogIds);

    const withRelations = await this.blogRepo.findOne({
      where: { id: blog.id },
      relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
    });
    return this.formatBlog(withRelations as Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] });
  }

  async remove(id: number) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new HttpError("Blog not found", 404);
    await this.blogRepo.remove(blog);
    return { success: true as const };
  }
}

export const blogService = new BlogService();
