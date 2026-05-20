import { apiRequest } from "@/lib/api-client";
import type { CourseDetail, CourseListItem } from "@/types/course";

export const courseService = {
  list: () => apiRequest<CourseListItem[]>("/courses"),

  getById: (id: number) => apiRequest<CourseDetail>(`/courses/${id}`),

  create: (payload: Record<string, unknown>) =>
    apiRequest<CourseDetail>("/courses", { method: "POST", body: payload }),

  update: (id: number, payload: Record<string, unknown>) =>
    apiRequest<CourseDetail>(`/courses/${id}`, { method: "PUT", body: payload }),

  remove: (id: number) =>
    apiRequest<{ success: boolean }>(`/courses/${id}`, { method: "DELETE" }),
};
