import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  ContentItem,
  ContentRepository,
  ContentTranslation,
  CreateContentInput,
} from "./types";
import { buildTranslations } from "./translations";

type ContentRow = {
  id: string;
  type: ContentItem["type"];
  slug: string;
  status: ContentItem["status"];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  content_translations: Array<{
    locale: ContentTranslation["locale"];
    title: string;
    summary: string;
    body: string;
    translation_status: ContentTranslation["status"];
  }>;
};

export class SupabaseContentRepository implements ContentRepository {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Configuração Supabase incompleta.");
    this.client = createClient(url, key, { auth: { persistSession: false } });
  }

  async list(): Promise<ContentItem[]> {
    const { data, error } = await this.client
      .from("content_items")
      .select("*, content_translations(locale,title,summary,body,translation_status)")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data || []) as ContentRow[]).map(mapRow);
  }

  async create(input: CreateContentInput): Promise<ContentItem> {
    const translations = await buildTranslations(input);
    const { data, error } = await this.client
      .from("content_items")
      .insert({
        type: input.type,
        slug: input.slug,
        status: input.status,
        source_locale: "pt",
        published_at: input.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();
    if (error) throw error;

    const { error: translationError } = await this.client.from("content_translations").insert(
      translations.map((translation) => ({
        content_id: data.id,
        locale: translation.locale,
        title: translation.title,
        summary: translation.summary,
        body: translation.body,
        translation_status: translation.status,
      })),
    );
    if (translationError) throw translationError;

    return mapRow({
      ...data,
      content_translations: translations.map((translation) => ({
        locale: translation.locale,
        title: translation.title,
        summary: translation.summary,
        body: translation.body,
        translation_status: translation.status,
      })),
    } as ContentRow);
  }
}

function mapRow(row: ContentRow): ContentItem {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    status: row.status,
    translations: row.content_translations.map((translation) => ({
      locale: translation.locale,
      title: translation.title,
      summary: translation.summary,
      body: translation.body,
      status: translation.translation_status,
    })),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
