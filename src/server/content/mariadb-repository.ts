import mysql, { type Pool } from "mysql2/promise";
import { randomUUID } from "node:crypto";

import type {
  ContentItem,
  ContentRepository,
  ContentTranslation,
  CreateContentInput,
} from "./types";
import { buildTranslations } from "./translations";

type JoinedRow = {
  id: string;
  type: ContentItem["type"];
  slug: string;
  status: ContentItem["status"];
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  locale: ContentTranslation["locale"] | null;
  title: string | null;
  summary: string | null;
  body: string | null;
  translation_status: ContentTranslation["status"] | null;
};

export class MariaDbContentRepository implements ContentRepository {
  private pool: Pool;

  constructor() {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error("DATABASE_URL não configurada.");
    this.pool = mysql.createPool(uri);
  }

  async list(): Promise<ContentItem[]> {
    const [rows] = await this.pool.query(
      `SELECT i.*, t.locale, t.title, t.summary, t.body, t.translation_status
       FROM content_items i
       LEFT JOIN content_translations t ON t.content_id = i.id
       ORDER BY i.updated_at DESC`,
    );
    return groupRows(rows as JoinedRow[]);
  }

  async create(input: CreateContentInput): Promise<ContentItem> {
    const id = randomUUID();
    const translations = await buildTranslations(input);
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO content_items
          (id, type, slug, status, source_locale, published_at)
         VALUES (?, ?, ?, ?, 'pt', ?)`,
        [id, input.type, input.slug, input.status, input.status === "published" ? new Date() : null],
      );
      for (const translation of translations) {
        await connection.execute(
          `INSERT INTO content_translations
            (id, content_id, locale, title, summary, body, translation_status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            randomUUID(),
            id,
            translation.locale,
            translation.title,
            translation.summary,
            translation.body,
            translation.status,
          ],
        );
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return (await this.list()).find((item) => item.id === id)!;
  }
}

function groupRows(rows: JoinedRow[]): ContentItem[] {
  const items = new Map<string, ContentItem>();
  for (const row of rows) {
    const item = items.get(row.id) || {
      id: row.id,
      type: row.type,
      slug: row.slug,
      status: row.status,
      translations: [],
      publishedAt: row.published_at?.toISOString() || null,
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
