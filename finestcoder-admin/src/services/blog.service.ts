import { apiRequest } from '@/lib/api-client';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type Blog = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  tags?: string[];
  relatedBlogIds?: number[];
  createdAt?: string;
};

export const blogService = {
  list: () => apiRequest<Blog[]>('/blogs'),
  getById: (id: number) => apiRequest<Blog>(`/blogs/${id}`),
  create: (payload: Record<string, unknown>) =>
    apiRequest<Blog>('/blogs', { method: 'POST', body: payload }),
  update: (id: number, payload: Record<string, unknown>) =>
    apiRequest<Blog>(`/blogs/${id}`, { method: 'PUT', body: payload }),
  remove: (id: number) => apiRequest<void>(`/blogs/${id}`, { method: 'DELETE' }),
};
