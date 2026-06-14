import { ArrowUpRight, Mail, MapPin, Music2, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/config/locales";
import { primaryNavigation } from "@/config/navigation";
import { getUi } from "@/config/ui";
import { getLocalizedText } from "@/lib/content";
import { pagePath } from "@/lib/paths";

export function SiteFooter({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/media/logo-apgb.png" alt="" width={132} height={50} unoptimized />
          <p>{ui.footerText}</p>
          <div className="footer-social" aria-label="Redes sociais">
            <a
              href="https://www.facebook.com/@Administra%C3%A7%C3%A3o-dos-Portos-da-Guin%C3%A9-Bissau-APGB-100044120232814/?locale=sw_KE"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook da APGB"
            >
              <span className="facebook-mark" aria-hidden="true">f</span>
            </a>
            <span aria-label="TikTok da APGB">
              <Music2 size={19} aria-hidden="true" />
            </span>
          </div>
        </div>
        <div>
          <h2>{ui.quickLinks}</h2>
          <nav className="footer-links">
            {primaryNavigation.slice(1).map((item) => (
              <Link key={item.slug} href={pagePath(locale, item.slug)}>
                {getLocalizedText(item.label, locale)}
              </Link>
            ))}
            <Link href={`/${locale}/galeria`}>{ui.gallery}</Link>
            <Link href={`/${locale}/documentos`}>{ui.documents}</Link>
          </nav>
        </div>
        <div>
          <h2>{ui.contact}</h2>
          <address className="footer-contact">
            <span>
              <MapPin size={17} aria-hidden="true" />
              Porto de Bissau, Guiné-Bissau
            </span>
            <a href="mailto:info@apgb.gw">
              <Mail size={17} aria-hidden="true" />
              info@apgb.gw
            </a>
            <a href="tel:+2450000000">
              <Phone size={17} aria-hidden="true" />
              +245 000 00 00
            </a>
          </address>
          <Link className="footer-admin" href="/admin">
            {ui.admin}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {ui.rights}</span>
        <span>Português · Français · English</span>
      </div>
    </footer>
  );
}
