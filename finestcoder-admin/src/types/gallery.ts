export type GalleryType = "internal" | "external";

export interface GalleryRow {
  id: number;
  type: GalleryType;
  title?: string | null;
  slug?: string | null;
  location?: string | null;
  coverImage?: string | null;
  description?: string | null;
  eventDate?: string | null;
  galleryImages?: Array<{ id?: number; imageUrl: string; altText?: string | null }>;
  __type?: GalleryType;
}
