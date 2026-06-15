export type MediaKind = "image" | "document" | "video";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: string;
  altText: string;
  url: string;
  path: string;
  contentType: string;
  size: number;
  createdAt: string;
};

export type CreateMediaInput = Omit<MediaItem, "id" | "kind" | "createdAt">;
export type UpdateMediaInput = Pick<MediaItem, "title" | "altText">;

export interface MediaRepository {
  list(): Promise<MediaItem[]>;
  create(input: CreateMediaInput): Promise<MediaItem>;
  update(id: string, input: UpdateMediaInput): Promise<MediaItem | null>;
  remove(id: string): Promise<boolean>;
}

export function mediaKind(contentType: string): MediaKind {
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  return "document";
}
