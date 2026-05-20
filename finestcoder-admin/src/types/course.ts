export interface CourseListItem {
  id: number;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export interface CourseDetail extends CourseListItem {
  description?: string | null;
  heroImage?: string | null;
  categoryId?: number | null;
  courseHighlights?: unknown[];
  courseStructure?: unknown[];
  courseFeatures?: unknown[];
}
