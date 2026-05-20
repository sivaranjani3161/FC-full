import { api } from "../api";

export interface ActiveCourse {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  heroImage?: string | null;
}

export const coursesService = {
  listActive: () => api.get<ActiveCourse[]>("/courses/active"),
  getBySlug: (slug: string) => api.get<unknown>(`/courses/slug/${slug}`),
};
