import { describe, expect, it } from "vitest";

import type { PageContent } from "@/content/pages";

import { listFeaturedPublicPages, resolvePublicPage } from "./public-content";
import type { ContentItem, ContentRepository } from "./types";

const staticPage: PageContent = {
  slug: "quem-somos",
  section: "autoridade-portuaria",
  title: { pt: "Quem somos", fr: "Qui sommes-nous", en: "Who we are" },
  summary: { pt: "Base", fr: "Base", en: "Base" },
  heroImage: "/base.webp",
  heroAlt: { pt: "Base", fr: "Base", en: "Base" },
  blocks: [],
};

function item(overrides: Partial<ContentItem> = {}): ContentItem {
  return {
    id: "content-1",
    type: "page",
    slug: "quem-somos",
    section: "autoridade-portuaria",
    status: "published",
    heroImage: "/dynamic.webp",
    heroAlt: "Imagem dinâmica",
    featured: false,
    galleryUrls: ["/gallery.webp"],
    documentUrls: ["/document.pdf"],
    translations: [
      {
        locale: "pt",
        title: "Quem somos actualizado",
        summary: "Resumo actualizado",
        body: "## Missão\n\nServir o país.\n\n## Visão\n\nModernizar o porto.",
        status: "source",
      },
    ],
    publishedAt: "2026-06-15T10:00:00.000Z",
    deletedAt: null,
    createdAt: "2026-06-15T09:00:00.000Z",
    updatedAt: "2026-06-15T10:00:00.000Z",
    ...overrides,
  };
}

function repository(content: ContentItem | null): ContentRepository {
  return {
    list: async () => (content ? [content] : []),
    getById: async () => content,
    getBySlug: async () => content,
    create: async () => item(),
    update: async () => content,
    archive: async () => content,
    remove: async () => content,
  };
}

describe("resolvePublicPage", () => {
  it("substitui a página estática por conteúdo dinâmico publicado", async () => {
    const page = await resolvePublicPage("quem-somos", repository(item()), () => staticPage);

    expect(page).toMatchObject({
      title: { pt: "Quem somos actualizado" },
      heroImage: "/dynamic.webp",
      galleryUrls: ["/gallery.webp"],
      documentUrls: ["/document.pdf"],
      publishedAt: {
        pt: "15 de junho de 2026",
        fr: "15 juin 2026",
        en: "June 15, 2026",
      },
    });
    expect(page?.blocks).toHaveLength(2);
  });

  it("mantém a página estática quando não existe conteúdo dinâmico", async () => {
    await expect(resolvePublicPage("quem-somos", repository(null), () => staticPage)).resolves.toBe(staticPage);
  });

  it("oculta uma página com substituição arquivada ou removida", async () => {
    await expect(resolvePublicPage("quem-somos", repository(item({ status: "archived" })), () => staticPage))
      .resolves.toBeNull();
    await expect(resolvePublicPage("quem-somos", repository(item({ deletedAt: "2026-06-15T11:00:00.000Z" })), () => staticPage))
      .resolves.toBeNull();
  });

  it("apresenta uma nova página dinâmica publicada", async () => {
    const dynamic = item({ slug: "nova-pagina", section: "projectos" });
    const page = await resolvePublicPage("nova-pagina", repository(dynamic), () => undefined);

    expect(page).toMatchObject({ slug: "nova-pagina", section: "projectos" });
  });
});

describe("listFeaturedPublicPages", () => {
  it("coloca conteúdos dinâmicos publicados e destacados antes da base", async () => {
    const dynamic = item({ slug: "noticia-dinamica", type: "news", featured: true });
    const featuredStatic = { ...staticPage, slug: "noticia-base", featured: true };

    const pages = await listFeaturedPublicPages(repository(dynamic), [featuredStatic], 3);

    expect(pages.map((page) => page.slug)).toEqual(["noticia-dinamica", "noticia-base"]);
  });

  it("exclui rascunhos, arquivos e registos removidos", async () => {
    for (const hidden of [
      item({ status: "draft", featured: true }),
      item({ status: "archived", featured: true }),
      item({ deletedAt: "2026-06-15T11:00:00.000Z", featured: true }),
    ]) {
      await expect(listFeaturedPublicPages(repository(hidden), [], 3)).resolves.toEqual([]);
    }
  });
});
