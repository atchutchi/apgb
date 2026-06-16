import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { primaryNavigation } from "@/config/navigation";

import { pages } from "./pages";

describe("public page catalogue", () => {
  it("provides a page with contextual imagery for every approved menu entry", () => {
    const expected = primaryNavigation.flatMap((section) => [
      section.slug,
      ...(section.children || []).map((item) => item.slug),
    ]);

    for (const slug of expected) {
      const page = pages.find((item) => item.slug === slug);
      expect(page, `Missing page for ${slug || "home"}`).toBeDefined();
      expect(page?.heroImage).toMatch(/^\/media\//);
      expect(
        existsSync(join(process.cwd(), "public", page!.heroImage.replace(/^\//, ""))),
        `Missing hero image for ${slug || "home"}: ${page?.heroImage}`,
      ).toBe(true);
      expect(page?.summary.pt.length).toBeGreaterThan(30);
    }
  });

  it("keeps all public page slugs unique", () => {
    expect(new Set(pages.map((page) => page.slug)).size).toBe(pages.length);
  });

  it("uses parent menu pages as section indexes instead of generic article pages", () => {
    const parentSlugs = primaryNavigation.map((section) => section.slug).filter(Boolean);

    for (const slug of parentSlugs) {
      const page = pages.find((item) => item.slug === slug);
      const navigation = primaryNavigation.find((section) => section.slug === slug);

      expect(page?.blocks, `${slug} should not render generic filler blocks`).toEqual([]);
      expect(page?.menuItems?.map((item) => item.slug)).toEqual(
        navigation?.children?.filter((item) => !item.group).map((item) => item.slug),
      );
    }
  });

  it("uses the approved images for the Director-General and institutional pages", () => {
    expect(pages.find((page) => page.slug === "mensagem-do-director-geral")?.heroImage).toBe(
      "/media/gallery/dsc_4003.webp",
    );
    expect(pages.find((page) => page.slug === "quem-somos")?.heroImage).toBe(
      "/media/gallery/dsc_3989.webp",
    );
    expect(pages.find((page) => page.slug === "comunicacao")?.heroImage).toBe(
      "/media/gallery/apgb1.webp",
    );
    expect(pages.find((page) => page.slug === "comunidade-portuaria")?.heroImage).toBe(
      "/media/gallery/apgb2.webp",
    );
  });

  it("publishes the dredging project and the recent dredging news", () => {
    expect(pages.find((page) => page.slug === "dragagem")?.galleryUrls?.length).toBeGreaterThan(20);
    expect(
      pages.find((page) => page.slug === "inicio-trabalhos-dragagem-porto-bissau")?.publishedAt?.pt,
    ).toBe("21 de Janeiro de 2026");
  });
});
