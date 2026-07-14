import type { Locale } from "@/config/locales";
import type { OrganizationChart as OrganizationChartData, OrganizationNode } from "@/content/pages";
import { getLocalizedText } from "@/lib/content";

function NodeList({ nodes, locale }: { nodes: OrganizationNode[]; locale: Locale }) {
  return (
    <div className="organization-node-list">
      {nodes.map((node) => (
        <div className={`organization-node organization-node--${node.variant || "unit"}`} key={getLocalizedText(node.title, locale)}>
          <span>{getLocalizedText(node.title, locale)}</span>
          {!!node.children?.length && (
            <div className="organization-node__children">
              <NodeList nodes={node.children} locale={locale} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function OrganizationChart({ chart, locale }: { chart: OrganizationChartData; locale: Locale }) {
  return (
    <div className="organization-chart" aria-labelledby="organization-chart-title">
      <div className="organization-chart__intro">
        <h2 id="organization-chart-title">{getLocalizedText(chart.title, locale)}</h2>
        <p>{getLocalizedText(chart.summary, locale)}</p>
      </div>

      <div className="organization-chart__levels" aria-label="Áreas de organização">
        {chart.levels.map((level, index) => (
          <span key={getLocalizedText(level, locale)}>
            <b>{index + 1}</b>
            {getLocalizedText(level, locale)}
          </span>
        ))}
      </div>

      <div className="organization-chart__governance">
        <NodeList nodes={chart.governance} locale={locale} />
      </div>

      <div className="organization-chart__support">
        <div>
          <span className="organization-chart__eyebrow">Apoio técnico e controlo</span>
          <p>Gabinetes e unidades que apoiam a Direcção-Geral e asseguram o controlo especializado.</p>
        </div>
        <NodeList nodes={chart.support} locale={locale} />
      </div>

      <div className="organization-chart__services">
        <div className="organization-chart__section-heading">
          <span className="organization-chart__eyebrow">Desenvolvimento de negócio</span>
          <p>Direcções de serviços, departamentos e unidades operacionais da APGB-ECP.</p>
        </div>
        <NodeList nodes={chart.services} locale={locale} />
      </div>
    </div>
  );
}
