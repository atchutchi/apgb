import { translateText } from "@/server/translation";

import type { ContentTranslation, CreateContentInput } from "./types";

export async function buildTranslations(input: CreateContentInput): Promise<ContentTranslation[]> {
  const source: ContentTranslation = {
    locale: "pt",
    title: input.title,
    summary: input.summary,
    body: input.body,
    status: "source",
  };
  if (!input.translate) return [source];

  const translations = await Promise.all(
    ([
      { locale: "fr", target: "FR" },
      { locale: "en", target: "EN" },
    ] as const).map(async ({ locale, target }) => {
      const [title, summary, body] = await Promise.all([
        translateText(input.title, target),
        translateText(input.summary, target),
        translateText(input.body, target),
      ]);
      return {
        locale,
        title: title.text,
        summary: summary.text,
        body: body.text,
        status:
          title.status === "translated" &&
          summary.status === "translated" &&
          body.status === "translated"
            ? "translated"
            : "source-fallback",
      } satisfies ContentTranslation;
    }),
  );
  return [source, ...translations];
}
