import { apiRequest } from '@/lib/api-client';

export type Testimonial = {
  id: number;
  name: string;
  role?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  type: 'VIDEO' | 'TEXT';
  isActive: boolean;
  sortOrder?: number;
};

export const testimonialService = {
  list: () => apiRequest<Testimonial[]>('/testimonials'),
  create: (payload: Record<string, unknown>) =>
    apiRequest<Testimonial>('/testimonials', { method: 'POST', body: payload }),
  update: (id: number, payload: Record<string, unknown>) =>
    apiRequest<Testimonial>(`/testimonials/${id}`, { method: 'PUT', body: payload }),
  remove: (id: number) => apiRequest<void>(`/testimonials/${id}`, { method: 'DELETE' }),
};
