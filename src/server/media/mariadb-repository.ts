import { randomUUID } from "node:crypto";
import mysql from "mysql2/promise";

import { mediaKind, type CreateMediaInput, type MediaItem, type MediaRepository, type UpdateMediaInput } from "./types";

type MediaRow = {
  id: string; kind: MediaItem["kind"]; title: string; alt_text: string;
  public_url: string; storage_path: string; mime_type: string; size_bytes: number; created_at: Date;
};

export class MariaDbMediaRepository implements MediaRepository {
  private pool() {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
    return mysql.createPool(process.env.DATABASE_URL);
  }

  async list(): Promise<MediaItem[]> {
    const pool = this.pool();
    try {
      const [rows] = await pool.query("SELECT * FROM media_items ORDER BY created_at DESC");
      return (rows as MediaRow[]).map(mapRow);
    } finally {
      await pool.end();
    }
  }

  async create(input: CreateMediaInput): Promise<MediaItem> {
    const id = randomUUID();
    const pool = this.pool();
    try {
      await pool.execute(
        `INSERT INTO media_items (id, kind, title, alt_text, storage_path, public_url, mime_type, size_bytes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, mediaKind(input.contentType), input.title, input.altText, input.path, input.url, input.contentType, input.size],
      );
      return (await this.list()).find((item) => item.id === id)!;
    } finally {
      await pool.end();
    }
  }

  async update(id: string, input: UpdateMediaInput): Promise<MediaItem | null> {
    const pool = this.pool();
    try {
      await pool.execute("UPDATE media_items SET title=?, alt_text=? WHERE id=?", [input.title, input.altText, id]);
      return (await this.list()).find((item) => item.id === id) || null;
    } finally {
      await pool.end();
    }
  }

  async remove(id: string): Promise<boolean> {
    const pool = this.pool();
    try {
      const [result] = await pool.execute("DELETE FROM media_items WHERE id=?", [id]);
      return Boolean((result as { affectedRows?: number }).affectedRows);
    } finally {
      await pool.end();
    }
  }
}

function mapRow(row: MediaRow): MediaItem {
  return {
    id: row.id, kind: row.kind, title: row.title, altText: row.alt_text,
    url: row.public_url, path: row.storage_path, contentType: row.mime_type,
    size: row.size_bytes, createdAt: row.created_at.toISOString(),
  };
}
