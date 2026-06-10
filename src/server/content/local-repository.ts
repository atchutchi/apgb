import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import type { ContentItem, ContentRepository, CreateContentInput } from "./types";
import { buildTranslations } from "./translations";

const runtimeFile = join(process.cwd(), "data", "runtime", "content.json");

async function readItems(): Promise<ContentItem[]> {
  try {
    return JSON.parse(await readFile(runtimeFile, "utf8")) as ContentItem[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export class LocalContentRepository implements ContentRepository {
  async list(): Promise<ContentItem[]> {
    return (await readItems()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async create(input: CreateContentInput): Promise<ContentItem> {
    const items = await readItems();
    const now = new Date().toISOString();
    const translations = await buildTranslations(input);
    const item: ContentItem = {
      id: randomUUID(),
      type: input.type,
      slug: input.slug,
      status: input.status,
      translations,
      publishedAt: input.status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    await mkdir(dirname(runtimeFile), { recursive: true });
    await writeFile(runtimeFile, JSON.stringify([item, ...items], null, 2));
    return item;
  }
}
