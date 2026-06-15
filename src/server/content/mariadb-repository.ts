import { randomUUID } from "node:crypto";
import mysql, { type Pool, type PoolConnection } from "mysql2/promise";

import type {
  ContentItem,
  ContentRepository,
  ContentTranslation,
  CreateContentInput,
  UpdateContentInput,
} from "./types";
import { buildTranslations } from "./translations";

type JoinedRow = {
  id: string;
  type: ContentItem["type"];
  slug: string;
  section: string;
  status: ContentItem["status"];
  hero_image: string | null;
  hero_alt: string;
  featured: number;
  gallery_urls: string | null;
  document_urls: string | null;
  published_at: Date | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  locale: ContentTranslation["locale"] | null;
  title: string | null;
  summary: string | null;
  body: string | null;
  translation_status: ContentTranslation["status"] | null;
};

type DbValue = string | number | boolean | Date | null;

const joinedSelect = `SELECT i.*, t.locale, t.title, t.summary, t.body, t.translation_status
  FROM content_items i LEFT JOIN content_translations t ON t.content_id = i.id`;

export class MariaDbContentRepository implements ContentRepository {
  private get pool(): Pool {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error("DATABASE_URL não configurada.");
    return mysql.createPool(uri);
  }

  async list(): Promise<ContentItem[]> {
    const [rows] = await this.pool.query(`${joinedSelect} WHERE i.deleted_at IS NULL ORDER BY i.updated_at DESC`);
    return groupRows(rows as JoinedRow[]);
  }

  async getById(id: string): Promise<ContentItem | null> {
    return this.getOne("id", id);
  }

  async getBySlug(slug: string): Promise<ContentItem | null> {
    return this.getOne("slug", slug);
  }

  private async getOne(field: "id" | "slug", value: string): Promise<ContentItem | null> {
    const [rows] = await this.pool.execute(`${joinedSelect} WHERE i.${field} = ?`, [value]);
    return groupRows(rows as JoinedRow[])[0] || null;
  }

  async create(input: CreateContentInput): Promise<ContentItem> {
    const id = randomUUID();
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await this.insertItem(connection, id, input);
      await this.replaceTranslations(connection, id, await buildTranslations(input));
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return (await this.getById(id))!;
  }

  async update(id: string, input: UpdateContentInput): Promise<ContentItem | null> {
    const previous = await this.getById(id);
    if (!previous) return null;
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await this.saveVersion(connection, previous);
      await connection.execute(
        `UPDATE content_items SET type=?, slug=?, section=?, status=?, hero_image=?, hero_alt=?,
          featured=?, gallery_urls=?, document_urls=?, published_at=?, deleted_at=NULL
         WHERE id=?`,
        values(input, id),
      );
      await this.replaceTranslations(connection, id, await buildTranslations(input));
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return this.getById(id);
  }

  async archive(id: string): Promise<ContentItem | null> {
    return this.changeState(id, "status='archived', published_at=NULL");
  }

  async remove(id: string): Promise<ContentItem | null> {
    return this.changeState(id, "deleted_at=CURRENT_TIMESTAMP");
  }

  private async changeState(id: string, sql: string): Promise<ContentItem | null> {
    const previous = await this.getById(id);
    if (!previous) return null;
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await this.saveVersion(connection, previous);
      await connection.execute(`UPDATE content_items SET ${sql} WHERE id=?`, [id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return this.getById(id);
  }

  private async insertItem(connection: PoolConnection, id: string, input: CreateContentInput) {
    await connection.execute(
      `INSERT INTO content_items
        (id, type, slug, section, status, source_locale, hero_image, hero_alt, featured,
         gallery_urls, document_urls, published_at)
       VALUES (?, ?, ?, ?, ?, 'pt', ?, ?, ?, ?, ?, ?)`,
      [id, ...values(input)],
    );
  }

  private async saveVersion(connection: PoolConnection, item: ContentItem) {
    await connection.execute(
      "INSERT INTO content_versions (id, content_id, snapshot) VALUES (?, ?, ?)",
      [randomUUID(), item.id, JSON.stringify(item)],
    );
  }

  private async replaceTranslations(
    connection: PoolConnection,
    id: string,
    translations: ContentTranslation[],
  ) {
    await connection.execute("DELETE FROM content_translations WHERE content_id=?", [id]);
    for (const item of translations) {
      await connection.execute(
        `INSERT INTO content_translations
          (id, content_id, locale, title, summary, body, translation_status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [randomUUID(), id, item.locale, item.title, item.summary, item.body, item.status],
      );
    }
  }
}

function values(input: CreateContentInput, id?: string): DbValue[] {
  const result: DbValue[] = [
    input.type,
    input.slug,
    input.section || "autoridade-portuaria",
    input.status,
    input.heroImage || null,
    input.heroAlt || "",
    input.featured || false,
    JSON.stringify(input.galleryUrls || []),
    JSON.stringify(input.documentUrls || []),
    input.status === "published" ? new Date() : null,
  ];
  if (id) result.push(id);
  return result;
}

function jsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

function groupRows(rows: JoinedRow[]): ContentItem[] {
  const items = new Map<string, ContentItem>();
  for (const row of rows) {
    const item: ContentItem = items.get(row.id) || {
      id: row.id,
      type: row.type,
      slug: row.slug,
      section: row.section,
      status: row.status,
      heroImage: row.hero_image,
      heroAlt: row.hero_alt,
      featured: Boolean(row.featured),
      galleryUrls: jsonArray(row.gallery_urls),
      documentUrls: jsonArray(row.document_urls),
      translations: [],
      publishedAt: row.published_at?.toISOString() || null,
      deletedAt: row.deleted_at?.toISOString() || null,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
    if (row.locale && row.title && row.summary !== null && row.body !== null) {
      item.translations.push({
        locale: row.locale,
        title: row.title,
        summary: row.summary,
        body: row.body,
        status: row.translation_status || "source-fallback",
      });
    }
    items.set(row.id, item);
  }
  return [...items.values()];
}
