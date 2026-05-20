import { apiRequest } from '@/lib/api-client';
import type { GalleryRow } from '@/types/gallery';

export const galleryService = {
  list: () => apiRequest<GalleryRow[]>('/gallery'),
  getById: (id: number) => apiRequest<GalleryRow>(`/gallery/${id}`),
  create: (payload: Record<string, unknown>) =>
    apiRequest<GalleryRow>('/gallery', { method: 'POST', body: payload }),
  update: (id: number, payload: Record<string, unknown>) =>
    apiRequest<GalleryRow>(`/gallery/${id}`, { method: 'PUT', body: payload }),
  remove: (id: number) => apiRequest<void>(`/gallery/${id}`, { method: 'DELETE' }),
};
