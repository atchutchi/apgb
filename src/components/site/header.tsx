import { ChevronDown, Images, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/config/locales";
import { locales } from "@/config/locales";
import { primaryNavigation } from "@/config/navigation";
import { getUi } from "@/config/ui";
import { getLocalizedText } from "@/lib/content";
import { pagePath } from "@/lib/paths";

import { MenuController } from "./menu-controller";

export function SiteHeader({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Saltar para o conteúdo
      </a>
      <div className="government-bar">
        <div className="shell government-bar__inner">
          <Image
            className="government-flag"
            src="/media/flag-guinea-bissau.png"
            alt=""
            width={28}
            height={14}
            priority
            unoptimized
          />
          <span>{ui.government}</span>
          <nav className="utility-nav" aria-label="Navegação utilitária">
            <Link href={`/${locale}/galeria`}>
              <Images size={14} aria-hidden="true" />
              {ui.gallery}
            </Link>
            <Link href={`/${locale}/documentos`}>{ui.documents}</Link>
            <Link href="/admin">{ui.admin}</Link>
          </nav>
        </div>
      </div>
      <header className="site-header">
        <div className="shell site-header__main">
          <Link className="brand" href={`/${locale}`} aria-label={`${ui.authority}, ${ui.home}`}>
            <Image src="/media/logo-apgb.png" alt="" width={116} height={44} priority unoptimized />
            <span>
              <strong>APGB</strong>
              <small>{ui.authority}</small>
            </span>
          </Link>
          <div className="header-actions">
            <nav className="language-switcher" aria-label="Idiomas">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className={item === locale ? "is-active" : undefined}
                  hrefLang={item}
                >
                  {item.toUpperCase()}
                </Link>
              ))}
            </nav>
            <Link className="search-button" href={`/${locale}/documentos`} aria-label={ui.documents}>
              <Search size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <MenuController className="primary-nav shell" label="Menu principal">
          {primaryNavigation.map((item) =>
            item.children?.length ? (
              <details className="nav-group" key={item.slug}>
                <summary>
                  {getLocalizedText(item.label, locale)}
                  <ChevronDown size={15} aria-hidden="true" />
                </summary>
                <div className="mega-menu">
                  <div className="mega-menu__intro">
                    <span>{ui.explore}</span>
                    <strong>{getLocalizedText(item.label, locale)}</strong>
                    <Link href={pagePath(locale, item.slug)}>{ui.readMore}</Link>
                  </div>
                  <div className="mega-menu__links">
                    {item.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={pagePath(locale, child.slug)}
                        className={child.group ? "is-group" : undefined}
                      >
                        {getLocalizedText(child.label, locale)}
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ) : (
              <Link className="primary-nav__home" href={pagePath(locale, item.slug)} key="home">
                {getLocalizedText(item.label, locale)}
              </Link>
            ),
          )}
          <details className="mobile-navigation">
            <summary>
              <Menu size={18} aria-hidden="true" />
              {ui.menu}
            </summary>
            <div>
              {primaryNavigation.map((item) => (
                <Link key={item.slug || "home"} href={pagePath(locale, item.slug)}>
                  {getLocalizedText(item.label, locale)}
                </Link>
              ))}
            </div>
          </details>
        </MenuController>
      </header>
    </>
  );
}
