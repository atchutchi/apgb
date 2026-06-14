import { ArrowDownToLine, ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/config/locales";
import { primaryNavigation } from "@/config/navigation";
import { getUi } from "@/config/ui";
import media from "@/content/media-manifest.json";
import type { PageContent } from "@/content/pages";
import { getLocalizedText } from "@/lib/content";
import { pagePath } from "@/lib/paths";

function documentName(url: string): string {
  return (
    media.documents.find((document) => document.url === url)?.title ||
    url.split("/").at(-1)?.replace(".pdf", "") ||
    "Documento APGB"
  );
}

export function ContentView({ locale, page }: { locale: Locale; page: PageContent }) {
  const ui = getUi(locale);
  const section = primaryNavigation.find((item) => item.slug === page.section);
  const related = (section?.children || [])
    .filter((item) => !item.group && item.slug !== page.slug)
    .slice(0, 5);
  const photoStart = Math.abs(page.slug.split("").reduce((total, char) => total + char.charCodeAt(0), 0)) %
    (media.gallery.length - 3);

  return (
    <>
      <section className="page-hero">
        <div
          className={
            page.slug === "comunidade-portuaria"
              ? "page-hero__photo page-hero__photo--top"
              : "page-hero__photo"
          }
        >
          <Image
            src={page.heroImage}
            alt={getLocalizedText(page.heroAlt, locale)}
            fill
            sizes="(max-width: 800px) 100vw, 64vw"
            priority
          />
        </div>
        <div className="page-hero__veil" />
        <div className="shell page-hero__content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{ui.home}</Link>
            {section && <Link href={pagePath(locale, section.slug)}>{getLocalizedText(section.label, locale)}</Link>}
            <span aria-current="page">{getLocalizedText(page.title, locale)}</span>
          </nav>
          <div>
            <span className="status-chip">
              <span aria-hidden="true" />
              {page.publishedAt ? getLocalizedText(page.publishedAt, locale) : ui.currentInfo}
            </span>
            <h1>{getLocalizedText(page.title, locale)}</h1>
            <p>{getLocalizedText(page.summary, locale)}</p>
          </div>
        </div>
      </section>

      <div className="shell article-layout">
        <article className="article">
          {locale !== "pt" && page.summary[locale] === page.summary.pt && (
            <p className="translation-note">{ui.publishedInPt}</p>
          )}
          {page.blocks.map((block, index) => (
            <section key={`${page.slug}-${index}`}>
              <span className="article-index">{String(index + 1).padStart(2, "0")}</span>
              <h2>{getLocalizedText(block.title, locale)}</h2>
              <p>{getLocalizedText(block.text, locale)}</p>
            </section>
          ))}
          {page.slug === "organigrama" && (
            <figure className="support-figure">
              <Image
                src="/media/support/organigrama-3.webp"
                alt="Organigrama da Administração dos Portos da Guiné-Bissau"
                width={1400}
                height={800}
              />
            </figure>
          )}
          {page.slug === "tarifario" && (
            <div className="support-gallery">
              {media.support
                .filter((item) => item.title.toLowerCase().includes("tarifa"))
                .slice(0, 3)
                .map((item) => (
                  <figure key={item.url}>
                    <Image src={item.url} alt={item.title} width={900} height={560} />
                    <figcaption>{item.title}</figcaption>
                  </figure>
                ))}
            </div>
          )}
          {!!page.documentUrls?.length && (
            <section className="documents-block">
              <span className="article-index">{String(page.blocks.length + 1).padStart(2, "0")}</span>
              <h2>{ui.availableDocuments}</h2>
              <div className="document-list">
                {page.documentUrls.map((url) => (
                  <a href={url} key={url} target="_blank" rel="noreferrer">
                    <FileText size={22} aria-hidden="true" />
                    <span>
                      <strong>{documentName(url)}</strong>
                      <small>PDF · {ui.openDocument}</small>
                    </span>
                    <ArrowDownToLine size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          )}
          {!!page.galleryUrls?.length && (
            <section className="article-photo-story">
              <span className="article-index">{String(page.blocks.length + 1).padStart(2, "0")}</span>
              <h2>{ui.photoArchive}</h2>
              <div className="article-photo-story__grid">
                {page.galleryUrls.map((url, index) => {
                  const photo = media.gallery.find((item) => item.url === url);
                  return (
                    <figure key={url} className={index === 0 ? "is-featured" : undefined}>
                      <Image
                        src={url}
                        alt={photo?.alt || getLocalizedText(page.heroAlt, locale)}
                        fill
                        sizes="(max-width: 800px) 100vw, 40vw"
                      />
                    </figure>
                  );
                })}
              </div>
            </section>
          )}
        </article>
        <aside className="article-aside">
          <span>{ui.related}</span>
          <nav>
            {related.map((item) => (
              <Link href={pagePath(locale, item.slug)} key={item.slug}>
                {getLocalizedText(item.label, locale)}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <section className="context-gallery">
        <div className="shell section-heading">
          <div>
            <h2>{ui.photoArchive}</h2>
            <p>{ui.photoArchiveIntro}</p>
          </div>
          <Link href={`/${locale}/galeria`}>
            {ui.allPhotos}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="context-gallery__grid">
          {(page.galleryUrls?.length
            ? page.galleryUrls.slice(0, 3).map((url) => media.gallery.find((photo) => photo.url === url)!)
            : media.gallery.slice(photoStart, photoStart + 3)
          ).map((photo) => (
            <figure key={photo.url}>
              <Image src={photo.url} alt={photo.alt} fill sizes="33vw" />
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
