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
  status: ContentStatus;
  translations: ContentTranslation[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateContentInput = {
  type: ContentType;
  slug: string;
  status: ContentStatus;
  title: string;
  summary: string;
  body: string;
  translate: boolean;
};

export interface ContentRepository {
  list(): Promise<ContentItem[]>;
  create(input: CreateContentInput): Promise<ContentItem>;
}
