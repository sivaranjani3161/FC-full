export type CourseBasic = {
  id: number;
  title: string;
  slug: string;
};

export type CategoryWithCourses = {
  id: number;
  name: string;
  slug: string;
  courses: CourseBasic[];
};
