export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface CourseCategoryForm {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export const emptyCategoryForm: CourseCategoryForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
};
