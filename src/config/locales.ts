export const locales = ["pt", "fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
  return `/${locale}${normalized}`;
}

