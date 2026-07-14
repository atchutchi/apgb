"use client";

import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Locale } from "@/config/locales";
import type { PageContent } from "@/content/pages";
import { getLocalizedText } from "@/lib/content";
import { pagePath } from "@/lib/paths";

export function NewsSlider({ items, locale }: { items: PageContent[]; locale: Locale }) {
  const [current, setCurrent] = useState(0);

  if (!items.length) return null;

  const item = items[current];
  const previous = () => setCurrent((index) => (index - 1 + items.length) % items.length);
  const next = () => setCurrent((index) => (index + 1) % items.length);

  return (
    <div className="news-slider" aria-label="Últimas notícias">
      <div className="news-slider__stage" aria-live="polite">
        <div className="news-slider__image">
          <Image
            src={item.heroImage}
            alt={getLocalizedText(item.heroAlt, locale)}
            fill
            sizes="(max-width: 800px) 100vw, 46vw"
          />
        </div>
        <div className="news-slider__content">
          <span className="news-slider__meta">
            <CalendarDays size={16} aria-hidden="true" />
            {item.publishedAt ? getLocalizedText(item.publishedAt, locale) : "Notícia APGB"}
          </span>
          <h3>{getLocalizedText(item.title, locale)}</h3>
          <p>{getLocalizedText(item.summary, locale)}</p>
          <Link className="text-link" href={pagePath(locale, item.slug, item.section)}>
            Ver notícia
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
      {items.length > 1 && (
        <div className="news-slider__controls">
          <span>{String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <div>
            <button type="button" onClick={previous} aria-label="Notícia anterior" title="Notícia anterior">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={next} aria-label="Notícia seguinte" title="Notícia seguinte">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
