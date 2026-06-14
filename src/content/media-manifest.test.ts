import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import media from "./media-manifest.json";

describe("APGB media manifest", () => {
  it("matches every photograph currently published in the gallery directory", () => {
    const galleryUrls = readdirSync(join(process.cwd(), "public/media/gallery"))
      .filter((filename) => filename.endsWith(".webp") && !filename.startsWith("._"))
      .map((filename) => `/media/gallery/${filename}`);

    expect(new Set(media.gallery.map((item) => item.url))).toEqual(new Set(galleryUrls));
    expect(new Set(media.gallery.map((item) => item.source)).size).toBe(media.gallery.length);
  });

  it("assigns accessible descriptions and categories to every photograph", () => {
    for (const item of media.gallery) {
      expect(item.alt.length).toBeGreaterThan(12);
      expect(["pessoas", "operacoes", "infraestruturas", "navios"]).toContain(
        item.category,
      );
      expect(item.url.endsWith(".webp")).toBe(true);
    }
  });

  it("publishes the principal institutional documents without duplicate URLs", () => {
    expect(media.documents.length).toBeGreaterThanOrEqual(8);
    expect(new Set(media.documents.map((item) => item.url)).size).toBe(
      media.documents.length,
    );
  });
});
