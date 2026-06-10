import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentView } from "@/components/site/content-view";
import { HomeView } from "@/components/site/home-view";
import { DocumentsView, GalleryView } from "@/components/site/library-view";
import { isLocale, locales } from "@/config/locales";
import { primaryNavigation } from "@/config/navigation";
import { getPageBySlug, pages } from "@/content/pages";
import { getLocalizedText } from "@/lib/content";

type RouteParams = Promise<{ locale: string; segments?: string[] }>;

export async function generateStaticParams() {
  return locales.flatMap((locale) => [
    { locale, segments: undefined },
    { locale, segments: ["galeria"] },
    { locale, segments: ["documentos"] },
    ...pages
      .filter((page) => page.slug)
      .map((page) => {
        const primary = primaryNavigation.some((item) => item.slug === page.slug);
        return {
          locale,
          segments: primary ? [page.slug] : [page.section, page.slug],
        };
      }),
  ]);
}

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { locale, segments } = await params;
  if (!isLocale(locale)) return {};
  if (!segments?.length) return { title: "Administração dos Portos da Guiné-Bissau" };
  if (segments.at(-1) === "galeria") return { title: "Galeria" };
  if (segments.at(-1) === "documentos") return { title: "Documentos" };
  const page = getPageBySlug(segments.at(-1) || "");
  if (!page) return {};
  return {
    title: getLocalizedText(page.title, locale),
    description: getLocalizedText(page.summary, locale),
  };
}

export default async function PublicPage({ params }: { params: RouteParams }) {
  const { locale, segments } = await params;
  if (!isLocale(locale)) notFound();
  if (!segments?.length) return <HomeView locale={locale} />;

  const slug = segments.at(-1) || "";
  if (slug === "galeria") return <GalleryView locale={locale} />;
  if (slug === "documentos") return <DocumentsView locale={locale} />;

  const page = getPageBySlug(slug);
  if (!page) notFound();
  return <ContentView locale={locale} page={page} />;
}
