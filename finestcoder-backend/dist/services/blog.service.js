"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = exports.BlogService = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../config/data-source");
const Blog_1 = require("../entities/Blog");
const BlogTag_1 = require("../entities/BlogTag");
const RelatedBlog_1 = require("../entities/RelatedBlog");
const Tag_1 = require("../entities/Tag");
const BlogStatus_1 = require("../entities/enums/BlogStatus");
const slug_1 = require("../utils/slug");
const string_1 = require("../utils/string");
const http_1 = require("../utils/http");
class BlogService {
    blogRepo = data_source_1.AppDataSource.getRepository(Blog_1.Blog);
    blogTagRepo = data_source_1.AppDataSource.getRepository(BlogTag_1.BlogTag);
    relatedBlogRepo = data_source_1.AppDataSource.getRepository(RelatedBlog_1.RelatedBlog);
    tagRepo = data_source_1.AppDataSource.getRepository(Tag_1.Tag);
    formatBlog(blog) {
        return {
            ...blog,
            tags: blog.blogTags?.map((item) => item.tag?.name).filter(Boolean) ?? [],
            relatedBlogIds: blog.relatedBlogs?.map((item) => item.relatedBlogId) ?? [],
        };
    }
    async getOrCreateTags(tagNames) {
        const normalized = Array.from(new Set(tagNames.map((name) => (0, string_1.normalizeTagName)(String(name || ""))).filter(Boolean)));
        if (!normalized.length)
            return [];
        const existing = await this.tagRepo.find({ where: { name: (0, typeorm_1.In)(normalized) } });
        const map = new Map(existing.map((tag) => [tag.name, tag]));
        const toCreate = normalized.filter((name) => !map.has(name));
        for (const name of toCreate) {
            const created = this.tagRepo.create({ name, slug: (0, slug_1.slugify)(name) });
            const saved = await this.tagRepo.save(created);
            map.set(name, saved);
        }
        return normalized.map((name) => map.get(name)).filter(Boolean);
    }
    async syncTagRelations(blogId, tagNames) {
        await this.blogTagRepo.delete({ blogId });
        const tags = await this.getOrCreateTags(tagNames);
        if (!tags.length)
            return;
        await this.blogTagRepo.save(tags.map((tag) => this.blogTagRepo.create({ blogId, tagId: tag.id })));
    }
    async syncRelatedBlogs(blogId, ids) {
        await this.relatedBlogRepo.delete({ blogId });
        const cleanIds = Array.from(new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId)));
        if (!cleanIds.length)
            return;
        const available = await this.blogRepo.find({ where: { id: (0, typeorm_1.In)(cleanIds) }, select: { id: true } });
        const allowed = new Set(available.map((item) => item.id));
        await this.relatedBlogRepo.save(cleanIds
            .filter((id) => allowed.has(id))
            .map((relatedBlogId) => this.relatedBlogRepo.create({ blogId, relatedBlogId })));
    }
    async list() {
        const blogs = await this.blogRepo.find({
            relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
            order: { createdAt: "DESC" },
        });
        return blogs.map((blog) => this.formatBlog(blog));
    }
    async getById(id) {
        const blog = await this.blogRepo.findOne({
            where: { id },
            relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
        });
        if (!blog)
            throw new http_1.HttpError("Blog not found", 404);
        return this.formatBlog(blog);
    }
    async create(input) {
        const slugExists = await this.blogRepo.findOne({ where: { slug: input.slug } });
        if (slugExists)
            throw new http_1.HttpError("Slug already exists", 409);
        const blog = this.blogRepo.create({
            title: input.title,
            slug: input.slug,
            excerpt: input.excerpt ?? null,
            content: input.content ?? "",
            coverImage: input.coverImage ?? null,
            publishedAt: input.publishedAt ?? null,
            status: input.status ?? BlogStatus_1.BlogStatus.DRAFT,
            createdBy: input.createdBy,
        });
        const saved = await this.blogRepo.save(blog);
        await this.syncTagRelations(saved.id, input.tags ?? []);
        await this.syncRelatedBlogs(saved.id, input.relatedBlogIds ?? []);
        const withRelations = await this.blogRepo.findOne({
            where: { id: saved.id },
            relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
        });
        return this.formatBlog(withRelations);
    }
    async update(id, input) {
        const blog = await this.blogRepo.findOne({ where: { id } });
        if (!blog)
            throw new http_1.HttpError("Blog not found", 404);
        const nextSlug = input.slug !== undefined ? input.slug : blog.slug;
        if (!nextSlug)
            throw new http_1.HttpError("slug is required", 400);
        if (nextSlug !== blog.slug) {
            const slugExists = await this.blogRepo.findOne({ where: { slug: nextSlug } });
            if (slugExists && slugExists.id !== id) {
                throw new http_1.HttpError("Slug already exists", 409);
            }
        }
        if (input.title !== undefined)
            blog.title = input.title;
        blog.slug = nextSlug;
        if (input.excerpt !== undefined)
            blog.excerpt = input.excerpt ?? null;
        if (input.content !== undefined)
            blog.content = input.content;
        if (input.coverImage !== undefined)
            blog.coverImage = input.coverImage ?? null;
        if (input.publishedAt !== undefined)
            blog.publishedAt = input.publishedAt ?? null;
        if (input.status !== undefined)
            blog.status = input.status;
        await this.blogRepo.save(blog);
        if (input.tags !== undefined)
            await this.syncTagRelations(blog.id, input.tags);
        if (input.relatedBlogIds !== undefined)
            await this.syncRelatedBlogs(blog.id, input.relatedBlogIds);
        const withRelations = await this.blogRepo.findOne({
            where: { id: blog.id },
            relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
        });
        return this.formatBlog(withRelations);
    }
    async remove(id) {
        const blog = await this.blogRepo.findOne({ where: { id } });
        if (!blog)
            throw new http_1.HttpError("Blog not found", 404);
        await this.blogRepo.remove(blog);
        return { success: true };
    }
}
exports.BlogService = BlogService;
exports.blogService = new BlogService();
