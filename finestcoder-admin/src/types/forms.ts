import type { Blog, Course, CoursePayload, GalleryEvent, Testimonial } from './entities';
import type { GalleryType } from './gallery';

export type CourseFormProps = {
  initialData?: Course;
  onSave: (data: CoursePayload) => void;
  onCancel: () => void;
  loading?: boolean;
  categoryRefreshKey?: number;
};

export type BlogFormProps = {
  initialData?: Blog;
  onSave: (data: Partial<Blog> & { createdBy?: number }) => void;
  onCancel: () => void;
  loading?: boolean;
};

export type TestimonialFormProps = {
  initialData?: Testimonial;
  onSave: (data: Partial<Testimonial> & { createdBy?: number }) => void;
  onCancel: () => void;
  loading?: boolean;
};

export type UnifiedGalleryFormProps = {
  initialData?: GalleryEvent;
  galleryType: GalleryType;
  onSave: (data: Partial<GalleryEvent>, type: GalleryType) => void;
  onCancel: () => void;
  loading?: boolean;
};

export type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  compact?: boolean;
};

export type NestedItem = {
  id?: number;
  title: string;
  description?: string[];
  icon?: string | null;
  phaseNumber?: number;
  sortOrder?: number;
};

export type NestedEntityManagerProps = {
  items: NestedItem[];
  onChange: (items: NestedItem[]) => void;
  title: string;
  showIcon?: boolean;
  showPhase?: boolean;
};

export type CourseHighlightsManagerProps = {
  items: NestedItem[];
  onChange: (items: NestedItem[]) => void;
};

export type PermissionButtonProps = {
  module: string;
  operation: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export type PermissionGuardProps = {
  module: string;
  operation: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export type SidebarProps = {
  collapsed?: boolean;
};
