import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { mediaKind, type CreateMediaInput, type MediaItem, type MediaRepository, type UpdateMediaInput } from "./types";

const runtimeFile = join(process.cwd(), "data", "runtime", "media.json");

export class LocalMediaRepository implements MediaRepository {
  constructor(private readonly file = runtimeFile) {}

  private async read(): Promise<MediaItem[]> {
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as MediaItem[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  private async write(items: MediaItem[]) {
    await mkdir(dirname(this.file), { recursive: true });
    await writeFile(this.file, JSON.stringify(items, null, 2));
  }

  async list(): Promise<MediaItem[]> {
    return (await this.read()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(input: CreateMediaInput): Promise<MediaItem> {
    const item: MediaItem = {
      ...input,
      id: randomUUID(),
      kind: mediaKind(input.contentType),
      createdAt: new Date().toISOString(),
    };
    await this.write([item, ...(await this.read())]);
    return item;
  }

  async update(id: string, input: UpdateMediaInput): Promise<MediaItem | null> {
    const items = await this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;
    items[index] = { ...items[index], ...input };
    await this.write(items);
    return items[index];
  }

  async remove(id: string): Promise<boolean> {
    const items = await this.read();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    await this.write(filtered);
    return true;
  }
}
