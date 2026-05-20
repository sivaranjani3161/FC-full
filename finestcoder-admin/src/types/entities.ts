export type NestedCourseItem = {
  id?: number;
  title: string;
  description?: string[];
  icon?: string | null;
  phaseNumber?: number;
  sortOrder?: number;
};

export type Course = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  heroImage?: string | null;
  isActive: boolean;
  categoryId?: number | null;
  category?: { id: number; name: string; slug: string };
  courseHighlights?: NestedCourseItem[];
  courseStructure?: NestedCourseItem[];
  courseFeatures?: NestedCourseItem[];
  createdAt?: string;
  updatedAt?: string;
};

export type CoursePayload = Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'category'> & {
  createdBy?: number;
};

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
  updatedAt?: string;
};

export type TestimonialType = 'VIDEO' | 'TEXT';

export type Testimonial = {
  id: number;
  name: string;
  role?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  type: TestimonialType;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
};

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';

export type Enquiry = {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  courseId?: number | null;
  course?: { id: number; title: string; slug: string };
  createdAt?: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  status: string;
  authProvider?: string;
  roleId: number;
  role?: DbRoleRef;
  createdAt?: string;
};

export type DbRoleRef = {
  id: number;
  name: string;
  code: string;
};
