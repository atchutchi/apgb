import { describe, expect, it } from "vitest";

import media from "./media-manifest.json";

describe("APGB media manifest", () => {
  it("includes every unique high-resolution APGB photograph", () => {
    expect(media.gallery).toHaveLength(60);
    expect(new Set(media.gallery.map((item) => item.source)).size).toBe(60);
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
