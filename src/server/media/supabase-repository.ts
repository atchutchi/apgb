import { createClient } from "@supabase/supabase-js";

import { mediaKind, type CreateMediaInput, type MediaItem, type MediaRepository, type UpdateMediaInput } from "./types";

type MediaRow = {
  id: string;
  kind: MediaItem["kind"];
  title: string;
  alt_text: string;
  public_url: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export class SupabaseMediaRepository implements MediaRepository {
  private client() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Configuração Supabase incompleta.");
    return createClient(url, key, { auth: { persistSession: false } });
  }

  async list(): Promise<MediaItem[]> {
    const { data, error } = await this.client().from("media_items").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return ((data || []) as MediaRow[]).map(mapRow);
  }

  async create(input: CreateMediaInput): Promise<MediaItem> {
    const { data, error } = await this.client().from("media_items").insert({
      kind: mediaKind(input.contentType),
      title: input.title,
      alt_text: input.altText,
      public_url: input.url,
      storage_path: input.path,
      mime_type: input.contentType,
      size_bytes: input.size,
    }).select().single();
    if (error) throw error;
    return mapRow(data as MediaRow);
  }

  async update(id: string, input: UpdateMediaInput): Promise<MediaItem | null> {
    const { data, error } = await this.client().from("media_items")
      .update({ title: input.title, alt_text: input.altText }).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data ? mapRow(data as MediaRow) : null;
  }

  async remove(id: string): Promise<boolean> {
    const { error, count } = await this.client().from("media_items").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
}

function mapRow(row: MediaRow): MediaItem {
  return {
    id: row.id, kind: row.kind, title: row.title, altText: row.alt_text,
    url: row.public_url, path: row.storage_path, contentType: row.mime_type,
    size: row.size_bytes, createdAt: row.created_at,
  };
}
