import { apiRequest } from "@/lib/api-client";
import type { CourseCategory, CourseCategoryForm } from "@/types/category";

export const courseCategoryService = {
  list: () => apiRequest<CourseCategory[]>("/course-categories"),

  create: (payload: Pick<CourseCategoryForm, "name" | "slug" | "description">) =>
    apiRequest<CourseCategory>("/course-categories", {
      method: "POST",
      body: {
        name: payload.name.trim(),
        slug: payload.slug,
        description: payload.description || null,
      },
    }),

  update: (id: number, payload: Partial<CourseCategoryForm>) =>
    apiRequest<CourseCategory>(`/course-categories/${id}`, {
      method: "PUT",
      body: payload,
    }),

  remove: (id: number) =>
    apiRequest<{ success: boolean }>(`/course-categories/${id}`, { method: "DELETE" }),
};
