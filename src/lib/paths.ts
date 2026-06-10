import type { Locale } from "@/config/locales";
import { primaryNavigation } from "@/config/navigation";

export function pagePath(locale: Locale, slug: string): string {
  if (!slug) return `/${locale}`;

  const primary = primaryNavigation.find((item) => item.slug === slug);
  if (primary) return `/${locale}/${primary.slug}`;

  const section = primaryNavigation.find((item) =>
    item.children?.some((child) => child.slug === slug),
  );
  return `/${locale}/${section?.slug || "autoridade-portuaria"}/${slug}`;
}
