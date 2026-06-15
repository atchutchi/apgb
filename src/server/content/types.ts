export type ContentStatus = "draft" | "published" | "archived";
export type ContentType = "page" | "news" | "project" | "document" | "gallery" | "notice";

export type ContentTranslation = {
  locale: "pt" | "fr" | "en";
  title: string;
  summary: string;
  body: string;
  status: "source" | "translated" | "source-fallback";
};

export type ContentItem = {
  id: string;
  type: ContentType;
  slug: string;
  section: string;
  status: ContentStatus;
  heroImage: string | null;
  heroAlt: string;
  featured: boolean;
  galleryUrls: string[];
  documentUrls: string[];
  translations: ContentTranslation[];
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateContentInput = {
  type: ContentType;
  slug: string;
  section?: string;
  status: ContentStatus;
  title: string;
  summary: string;
  body: string;
  heroImage?: string;
  heroAlt?: string;
  featured?: boolean;
  galleryUrls?: string[];
  documentUrls?: string[];
  translate: boolean;
};

export type UpdateContentInput = CreateContentInput;

export interface ContentRepository {
  list(): Promise<ContentItem[]>;
  getById(id: string): Promise<ContentItem | null>;
  getBySlug(slug: string): Promise<ContentItem | null>;
  create(input: CreateContentInput): Promise<ContentItem>;
  update(id: string, input: UpdateContentInput): Promise<ContentItem | null>;
  archive(id: string): Promise<ContentItem | null>;
  remove(id: string): Promise<ContentItem | null>;
}
