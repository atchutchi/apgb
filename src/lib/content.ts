import type { Locale } from "@/config/locales";

export type LocalizedText = Partial<Record<Locale, string>> & { pt: string };

export function getLocalizedText(
  value: LocalizedText,
  locale: Locale,
): string {
  return value[locale] || value.pt;
}

