const APGB_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d428.3414898190754!2d-15.576848631917867!3d11.860167952849693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sapgb!5e1!3m2!1spt-PT!2s!4v1783980269867!5m2!1spt-PT!2s";

const APGB_MAP_URL = "https://maps.app.goo.gl/L4jMY9owQV9eq7U26";

export function LocationMap() {
  return (
    <section className="location-map" aria-labelledby="location-map-title">
      <div className="location-map__heading">
        <div>
          <span className="eyebrow">Localização institucional</span>
          <h2 id="location-map-title">Zona Portuária, Bissau</h2>
          <p>
            Administração dos Portos da Guiné-Bissau, na Zona Portuária de
            Bissau. Coordenadas: 11.860235, -15.576441.
          </p>
        </div>
        <a
          className="location-map__link"
          href={APGB_MAP_URL}
          rel="noreferrer"
          target="_blank"
        >
          Abrir no Google Maps
        </a>
      </div>
      <div className="location-map__frame">
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={APGB_MAP_EMBED_URL}
          title="Localização da APGB na Zona Portuária de Bissau"
        />
      </div>
    </section>
  );
}
