import { ArrowDownToLine, FileText } from "lucide-react";
import Image from "next/image";

import type { Locale } from "@/config/locales";
import { getUi } from "@/config/ui";
import media from "@/content/media-manifest.json";

export function GalleryView({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  return (
    <>
      <LibraryHero title={ui.allPhotos} summary={ui.photoArchiveIntro} image="/media/gallery/dsc_3978.webp" />
      <section className="section shell">
        <div className="gallery-masonry">
          {media.gallery.map((photo, index) => (
            <figure key={photo.url} className={index % 11 === 0 ? "is-featured" : undefined}>
              <Image src={photo.url} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 33vw" />
              <figcaption>{photo.category}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

export function DocumentsView({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  return (
    <>
      <LibraryHero
        title={ui.allDocuments}
        summary={ui.searchDocuments}
        image="/media/gallery/dsc_4000.webp"
      />
      <section className="section shell document-library">
        {media.documents.map((document, index) => (
          <a href={document.url} target="_blank" rel="noreferrer" key={document.url}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FileText size={28} strokeWidth={1.5} aria-hidden="true" />
            <strong>{document.title}</strong>
            <small>PDF</small>
            <ArrowDownToLine size={19} aria-hidden="true" />
          </a>
        ))}
      </section>
    </>
  );
}

function LibraryHero({ title, summary, image }: { title: string; summary: string; image: string }) {
  return (
    <section className="library-hero">
      <Image src={image} alt="" fill sizes="100vw" priority />
      <div className="page-hero__veil" />
      <div className="shell">
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
    </section>
  );
}
