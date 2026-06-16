import type { LocalizedText } from "@/lib/content";
import { primaryNavigation } from "@/config/navigation";
import { getPageBySlug, type ContentBlock, type PageContent } from "@/content/pages";

import { getContentRepository } from "./repository";
import type { ContentItem, ContentRepository, ContentTranslation } from "./types";

type StaticPageGetter = (slug: string) => PageContent | undefined;

const locales = ["pt", "fr", "en"] as const;

function translation(item: ContentItem, locale: (typeof locales)[number]): ContentTranslation {
  return item.translations.find((candidate) => candidate.locale === locale)
    || item.translations.find((candidate) => candidate.locale === "pt")
    || {
      locale,
      title: item.slug,
      summary: "",
      body: "",
      status: "source-fallback",
    };
}

function localized(item: ContentItem, field: "title" | "summary"): LocalizedText {
  return Object.fromEntries(locales.map((locale) => [locale, translation(item, locale)[field]])) as LocalizedText;
}

function localizedDate(value: string): LocalizedText {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return Object.fromEntries(locales.map((locale) => [locale, value])) as LocalizedText;
  }

  return Object.fromEntries(locales.map((locale) => [
    locale,
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
  ])) as LocalizedText;
}

function bodyBlocks(item: ContentItem): ContentBlock[] {
  const bodies = Object.fromEntries(locales.map((locale) => [locale, parseBody(translation(item, locale).body)]));
  const count = Math.max(...locales.map((locale) => bodies[locale].length), 0);
  return Array.from({ length: count }, (_, index) => ({
    title: Object.fromEntries(locales.map((locale) => [
      locale,
      bodies[locale][index]?.title || bodies.pt[index]?.title || "",
    ])) as LocalizedText,
    text: Object.fromEntries(locales.map((locale) => [
      locale,
      bodies[locale][index]?.text || bodies.pt[index]?.text || "",
    ])) as LocalizedText,
  }));
}

function parseBody(body: string): Array<{ title: string; text: string }> {
  const sections = body
    .split(/\n(?=##\s+)/)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.map((section, index) => {
    const lines = section.split("\n");
    const heading = lines[0]?.startsWith("## ") ? lines.shift()?.slice(3).trim() || "" : "";
    return {
      title: heading || (index === 0 ? "" : `Secção ${index + 1}`),
      text: lines.join("\n").trim() || (!heading ? section : ""),
    };
  });
}

function toPublicPage(item: ContentItem): PageContent {
  const menu = primaryNavigation.find((section) => section.slug === item.slug);
  return {
    slug: item.slug,
    section: item.section,
    title: localized(item, "title"),
    summary: localized(item, "summary"),
    heroImage: item.heroImage || "/media/gallery/apgb-hero.png",
    heroAlt: Object.fromEntries(locales.map((locale) => [locale, item.heroAlt])) as LocalizedText,
    blocks: bodyBlocks(item),
    documentUrls: item.documentUrls,
    galleryUrls: item.galleryUrls,
    publishedAt: item.publishedAt ? localizedDate(item.publishedAt) : undefined,
    featured: item.featured,
    menuItems: menu?.children
      ?.filter((child) => !child.group)
      .map((child) => ({
        slug: child.slug,
        label: child.label,
        summary: getPageBySlug(child.slug)?.summary
          || Object.fromEntries(locales.map((locale) => [locale, child.label[locale] || child.label.pt])) as LocalizedText,
      })),
  };
}

export async function resolvePublicPage(
  slug: string,
  repository: ContentRepository,
  staticPage: StaticPageGetter = getPageBySlug,
): Promise<PageContent | null | undefined> {
  const dynamic = await repository.getBySlug(slug);
  if (!dynamic) return staticPage(slug);
  if (dynamic.deletedAt || dynamic.status === "archived") return null;
  if (dynamic.status !== "published") return staticPage(slug);
  return toPublicPage(dynamic);
}

export async function getPublicPageBySlug(slug: string): Promise<PageContent | null | undefined> {
  return resolvePublicPage(slug, getContentRepository());
}

export async function listFeaturedPublicPages(
  repository: ContentRepository = getContentRepository(),
  staticPages: PageContent[] = [],
  limit = 3,
  type?: ContentItem["type"],
): Promise<PageContent[]> {
  const dynamic = (await repository.list())
    .filter((item) =>
      item.featured
      && item.status === "published"
      && !item.deletedAt
      && (!type || item.type === type),
    )
    .map(toPublicPage);
  const dynamicSlugs = new Set(dynamic.map((page) => page.slug));
  return [...dynamic, ...staticPages.filter((page) => !dynamicSlugs.has(page.slug))].slice(0, limit);
}
