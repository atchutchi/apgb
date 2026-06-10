import { afterEach, describe, expect, it, vi } from "vitest";

import { buildTranslations } from "./translations";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("automatic translations", () => {
  it("keeps Portuguese available as fallback when DeepL is not configured", async () => {
    vi.stubEnv("DEEPL_API_KEY", "");
    const translations = await buildTranslations({
      type: "news",
      slug: "teste",
      status: "published",
      title: "Título português",
      summary: "Resumo português disponível.",
      body: "Conteúdo português publicado de imediato.",
      translate: true,
    });

    expect(translations.map((item) => item.locale)).toEqual(["pt", "fr", "en"]);
    expect(translations[0].status).toBe("source");
    expect(translations[1].status).toBe("source-fallback");
    expect(translations[2].body).toBe(translations[0].body);
  });
});
