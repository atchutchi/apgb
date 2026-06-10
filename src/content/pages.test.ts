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
      expect(page?.summary.pt.length).toBeGreaterThan(30);
    }
  });

  it("keeps all public page slugs unique", () => {
    expect(new Set(pages.map((page) => page.slug)).size).toBe(pages.length);
  });

  it("uses the approved images for the Director-General and institutional pages", () => {
    expect(pages.find((page) => page.slug === "mensagem-do-director-geral")?.heroImage).toBe(
      "/media/gallery/dsc_4003.webp",
    );
    expect(pages.find((page) => page.slug === "quem-somos")?.heroImage).toBe(
      "/media/gallery/dsc_3989.webp",
    );
  });
});
