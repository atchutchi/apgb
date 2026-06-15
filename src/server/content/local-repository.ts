import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import type {
  ContentItem,
  ContentRepository,
  CreateContentInput,
  UpdateContentInput,
} from "./types";
import { buildTranslations } from "./translations";

const runtimeFile = join(process.cwd(), "data", "runtime", "content.json");

type ContentVersion = {
  id: string;
  contentId: string;
  snapshot: ContentItem;
  createdAt: string;
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

export class LocalContentRepository implements ContentRepository {
  constructor(private readonly file = runtimeFile) {}

  private async readItems(): Promise<ContentItem[]> {
    return readJson(this.file, []);
  }

  private async writeItems(items: ContentItem[]): Promise<void> {
    await mkdir(dirname(this.file), { recursive: true });
    await writeFile(this.file, JSON.stringify(items, null, 2));
  }

  private async saveVersion(item: ContentItem): Promise<void> {
    const file = `${this.file}.versions.json`;
    const versions = await readJson<ContentVersion[]>(file, []);
    versions.unshift({
      id: randomUUID(),
      contentId: item.id,
      snapshot: item,
      createdAt: new Date().toISOString(),
    });
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(versions, null, 2));
  }

  async list(): Promise<ContentItem[]> {
    return (await this.readItems())
      .filter((item) => !item.deletedAt)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getById(id: string): Promise<ContentItem | null> {
    return (await this.readItems()).find((item) => item.id === id) || null;
  }

  async getBySlug(slug: string): Promise<ContentItem | null> {
    return (await this.readItems()).find((item) => item.slug === slug) || null;
  }

  async create(input: CreateContentInput): Promise<ContentItem> {
    const items = await this.readItems();
    if (items.some((item) => item.slug === input.slug && !item.deletedAt)) {
      throw new Error(`Já existe conteúdo com o slug "${input.slug}".`);
    }
    const now = new Date().toISOString();
    const translations = await buildTranslations(input);
    const item: ContentItem = {
      id: randomUUID(),
      type: input.type,
      slug: input.slug,
      section: input.section || "autoridade-portuaria",
      status: input.status,
      heroImage: input.heroImage || null,
      heroAlt: input.heroAlt || "",
      featured: input.featured || false,
      galleryUrls: input.galleryUrls || [],
      documentUrls: input.documentUrls || [],
      translations,
      publishedAt: input.status === "published" ? now : null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    await this.writeItems([item, ...items]);
    return item;
  }

  async update(id: string, input: UpdateContentInput): Promise<ContentItem | null> {
    const items = await this.readItems();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;
    if (items.some((item) => item.id !== id && item.slug === input.slug && !item.deletedAt)) {
      throw new Error(`Já existe conteúdo com o slug "${input.slug}".`);
    }
    const previous = items[index];
    await this.saveVersion(previous);
    const now = new Date().toISOString();
    const updated: ContentItem = {
      ...previous,
      type: input.type,
      slug: input.slug,
      section: input.section || previous.section,
      status: input.status,
      heroImage: input.heroImage || null,
      heroAlt: input.heroAlt || "",
      featured: input.featured || false,
      galleryUrls: input.galleryUrls || [],
      documentUrls: input.documentUrls || [],
      translations: await buildTranslations(input),
      publishedAt: input.status === "published" ? previous.publishedAt || now : null,
      updatedAt: now,
    };
    items[index] = updated;
    await this.writeItems(items);
    return updated;
  }

  async archive(id: string): Promise<ContentItem | null> {
    return this.changeState(id, { status: "archived" });
  }

  async remove(id: string): Promise<ContentItem | null> {
    return this.changeState(id, { deletedAt: new Date().toISOString() });
  }

  private async changeState(
    id: string,
    change: Partial<Pick<ContentItem, "status" | "deletedAt">>,
  ): Promise<ContentItem | null> {
    const items = await this.readItems();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const previous = items[index];
    await this.saveVersion(previous);
    const updated = {
      ...previous,
      ...change,
      publishedAt: change.status === "archived" ? null : previous.publishedAt,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    await this.writeItems(items);
    return updated;
  }
}
