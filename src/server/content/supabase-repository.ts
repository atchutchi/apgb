import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  ContentItem,
  ContentRepository,
  ContentTranslation,
  CreateContentInput,
  UpdateContentInput,
} from "./types";
import { buildTranslations } from "./translations";

type ContentRow = {
  id: string;
  type: ContentItem["type"];
  slug: string;
  section: string;
  status: ContentItem["status"];
  hero_image: string | null;
  hero_alt: string;
  featured: boolean;
  gallery_urls: string[] | null;
  document_urls: string[] | null;
  published_at: string | null;
  deleted_at: string | null;
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

const selection = "*, content_translations(locale,title,summary,body,translation_status)";

export class SupabaseContentRepository implements ContentRepository {
  private get client(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Configuração Supabase incompleta.");
    return createClient(url, key, { auth: { persistSession: false } });
  }

  async list(): Promise<ContentItem[]> {
    const { data, error } = await this.client
      .from("content_items")
      .select(selection)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data || []) as ContentRow[]).map(mapRow);
  }

  async getById(id: string): Promise<ContentItem | null> {
    return this.getOne("id", id);
  }

  async getBySlug(slug: string): Promise<ContentItem | null> {
    return this.getOne("slug", slug);
  }

  private async getOne(field: "id" | "slug", value: string): Promise<ContentItem | null> {
    const { data, error } = await this.client.from("content_items").select(selection).eq(field, value).maybeSingle();
    if (error) throw error;
    return data ? mapRow(data as ContentRow) : null;
  }

  async create(input: CreateContentInput): Promise<ContentItem> {
    const translations = await buildTranslations(input);
    const { data, error } = await this.client
      .from("content_items")
      .insert(itemValues(input))
      .select()
      .single();
    if (error) throw error;
    await this.replaceTranslations(data.id, translations);
    return (await this.getById(data.id))!;
  }

  async update(id: string, input: UpdateContentInput): Promise<ContentItem | null> {
    const previous = await this.getById(id);
    if (!previous) return null;
    await this.saveVersion(previous);
    const { error } = await this.client
      .from("content_items")
      .update({ ...itemValues(input), updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    await this.replaceTranslations(id, await buildTranslations(input));
    return this.getById(id);
  }

  async archive(id: string): Promise<ContentItem | null> {
    return this.changeState(id, { status: "archived", published_at: null });
  }

  async remove(id: string): Promise<ContentItem | null> {
    return this.changeState(id, { deleted_at: new Date().toISOString() });
  }

  private async changeState(id: string, values: Record<string, unknown>): Promise<ContentItem | null> {
    const previous = await this.getById(id);
    if (!previous) return null;
    await this.saveVersion(previous);
    const { error } = await this.client
      .from("content_items")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return this.getById(id);
  }

  private async saveVersion(item: ContentItem): Promise<void> {
    const { error } = await this.client.from("content_versions").insert({ content_id: item.id, snapshot: item });
    if (error) throw error;
  }

  private async replaceTranslations(id: string, translations: ContentTranslation[]): Promise<void> {
    const { error: deleteError } = await this.client.from("content_translations").delete().eq("content_id", id);
    if (deleteError) throw deleteError;
    const { error } = await this.client.from("content_translations").insert(
      translations.map((item) => ({
        content_id: id,
        locale: item.locale,
        title: item.title,
        summary: item.summary,
        body: item.body,
        translation_status: item.status,
      })),
    );
    if (error) throw error;
  }
}

function itemValues(input: CreateContentInput) {
  return {
    type: input.type,
    slug: input.slug,
    section: input.section || "autoridade-portuaria",
    status: input.status,
    source_locale: "pt",
    hero_image: input.heroImage || null,
    hero_alt: input.heroAlt || "",
    featured: input.featured || false,
    gallery_urls: input.galleryUrls || [],
    document_urls: input.documentUrls || [],
    published_at: input.status === "published" ? new Date().toISOString() : null,
    deleted_at: null,
  };
}

function mapRow(row: ContentRow): ContentItem {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    section: row.section,
    status: row.status,
    heroImage: row.hero_image,
    heroAlt: row.hero_alt,
    featured: row.featured,
    galleryUrls: row.gallery_urls || [],
    documentUrls: row.document_urls || [],
    translations: row.content_translations.map((item) => ({
      locale: item.locale,
      title: item.title,
      summary: item.summary,
      body: item.body,
      status: item.translation_status,
    })),
    publishedAt: row.published_at,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
