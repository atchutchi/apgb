import {
  Anchor,
  ArrowRight,
  Boxes,
  FileText,
  HeartPulse,
  ShieldCheck,
  Ship,
  Waves,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/config/locales";
import { getUi } from "@/config/ui";
import media from "@/content/media-manifest.json";
import { getPageBySlug } from "@/content/pages";
import { getLocalizedText } from "@/lib/content";
import { pagePath } from "@/lib/paths";

const serviceSlugs = [
  { slug: "encontrar-contentor", icon: Boxes },
  { slug: "previsao-chegada", icon: Ship },
  { slug: "tabela-de-mare", icon: Waves },
  { slug: "tarifario", icon: FileText },
  { slug: "codigo-isps", icon: ShieldCheck },
  { slug: "posto-medico", icon: HeartPulse },
];

const projectSlugs = [
  "reabilitacao-modernizacao",
  "acessibilidade-maritima",
  "ajuda-navegacao",
];

export function HomeView({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const home = getPageBySlug("")!;
  const institutional = getPageBySlug("quem-somos")!;
  const directorGeneral = getPageBySlug("mensagem-do-director-geral")!;
  const projects = projectSlugs.map((slug) => getPageBySlug(slug)!);
  const highlights = [
    getPageBySlug("inicio-trabalhos-dragagem-porto-bissau")!,
    getPageBySlug("investimentos")!,
    getPageBySlug("tarifario")!,
  ];

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__photo">
          <Image
            src={home.heroImage}
            alt={getLocalizedText(home.heroAlt, locale)}
            fill
            sizes="(max-width: 800px) 100vw, 64vw"
            priority
          />
        </div>
        <div className="home-hero__veil" />
        <div className="shell home-hero__content">
          <span className="status-chip">
            <span aria-hidden="true" />
            {ui.currentInfo}
          </span>
          <h1>{getLocalizedText(home.title, locale)}</h1>
          <p>{getLocalizedText(home.summary, locale)}</p>
          <div className="hero-actions">
            <Link className="button button--primary" href={pagePath(locale, "caracterizacao")}>
              {ui.explore}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button button--glass" href={pagePath(locale, "previsao-chegada")}>
              {getLocalizedText(getPageBySlug("previsao-chegada")!.title, locale)}
            </Link>
          </div>
        </div>
        <div className="shell hero-facts" aria-label="Informação de referência">
          <div>
            <strong>Porto de Bissau</strong>
            <span>{ui.maritimeAccess}</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>{ui.operational}</span>
          </div>
          <div>
            <strong>ISPS</strong>
            <span>{ui.safety}</span>
          </div>
          <div>
            <strong>APGB</strong>
            <span>{ui.publicService}</span>
          </div>
        </div>
      </section>

      <section className="section section--services">
        <div className="shell">
          <div className="section-heading">
            <div>
              <h2>{ui.services}</h2>
              <p>{ui.servicesIntro}</p>
            </div>
            <Link href={pagePath(locale, "negocio-portuario")}>
              {ui.viewAll}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="services-grid">
            {serviceSlugs.map(({ slug, icon: Icon }, index) => {
              const page = getPageBySlug(slug)!;
              return (
                <Link href={pagePath(locale, slug)} key={slug} className="service-link">
                  <span className="service-link__number">{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                  <strong>{getLocalizedText(page.title, locale)}</strong>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section institutional-feature">
        <div className="shell feature-grid">
          <div className="feature-image">
            <Image
              src={institutional.heroImage}
              alt={getLocalizedText(institutional.heroAlt, locale)}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span className="image-index">01 / APGB</span>
          </div>
          <div className="feature-copy">
            <Anchor size={30} strokeWidth={1.5} aria-hidden="true" />
            <h2>{ui.institutional}</h2>
            <p>{ui.institutionalBody}</p>
            <blockquote>
              <strong>{getLocalizedText(getPageBySlug("missao-visao-valores")!.title, locale)}</strong>
              <span>{getLocalizedText(getPageBySlug("missao-visao-valores")!.summary, locale)}</span>
            </blockquote>
            <Link className="text-link" href={pagePath(locale, "quem-somos")}>
              {ui.readMore}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section director-message">
        <div className="shell director-message__grid">
          <div className="director-message__photo">
            <Image
              src={directorGeneral.heroImage}
              alt={getLocalizedText(directorGeneral.heroAlt, locale)}
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
            />
          </div>
          <div className="director-message__copy">
            <span>{getLocalizedText(directorGeneral.title, locale)}</span>
            <blockquote>
              “A nossa prioridade é construir uma operação portuária mais segura, eficiente,
              transparente e ao serviço do desenvolvimento da Guiné-Bissau.”
            </blockquote>
            <p>{getLocalizedText(directorGeneral.summary, locale)}</p>
            <small>© Administração dos Portos da Guiné-Bissau</small>
            <Link className="text-link" href={pagePath(locale, directorGeneral.slug)}>
              {ui.readMore}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--navy">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <div>
              <h2>{ui.projects}</h2>
              <p>{ui.projectsIntro}</p>
            </div>
            <Link href={pagePath(locale, "projectos")}>
              {ui.viewAll}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <Link href={pagePath(locale, project.slug)} className="project-card" key={project.slug}>
                <Image
                  src={project.heroImage}
                  alt={getLocalizedText(project.heroAlt, locale)}
                  fill
                  sizes="(max-width: 800px) 100vw, 33vw"
                />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{getLocalizedText(project.title, locale)}</strong>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <h2>{ui.latest}</h2>
              <p>{ui.latestIntro}</p>
            </div>
          </div>
          <div className="editorial-list">
            {highlights.map((item, index) => (
              <Link href={pagePath(locale, item.slug)} key={item.slug} className="editorial-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{getLocalizedText(getPageBySlug(item.section)!.title, locale)}</small>
                  <h3>{getLocalizedText(item.title, locale)}</h3>
                  <p>{getLocalizedText(item.summary, locale)}</p>
                </div>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section photo-preview">
        <div className="shell">
          <div className="section-heading">
            <div>
              <h2>{ui.photoArchive}</h2>
              <p>{ui.photoArchiveIntro}</p>
            </div>
            <Link href={`/${locale}/galeria`}>
              {ui.allPhotos}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="photo-rail">
          {media.gallery.slice(18, 25).map((photo, index) => (
            <figure key={photo.url} className={index === 2 ? "is-wide" : undefined}>
              <Image src={photo.url} alt={photo.alt} fill sizes="34vw" />
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
