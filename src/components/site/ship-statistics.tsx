import { ArrowDownToLine, BarChart3, Ship } from "lucide-react";

import type { ShipStatistics } from "@/content/ship-statistics";

function number(value: number): string {
  return value.toLocaleString("pt-PT");
}

function total(row: { discharged: number; loaded: number }): number {
  return row.discharged + row.loaded;
}

function shortSummaryRows(data: ShipStatistics) {
  return data.monthly.map((row) => ({
    period: row.period,
    movements: row.movements,
    discharged: row.discharged,
    loaded: row.loaded,
    total: total(row),
  }));
}

export function ShipStatisticsView({ data }: { data: ShipStatistics }) {
  const monthlyRows = shortSummaryRows(data);
  const monthlyDischarged = data.monthly.reduce((sum, row) => sum + row.discharged, 0);
  const monthlyLoaded = data.monthly.reduce((sum, row) => sum + row.loaded, 0);
  const monthlyMovements = data.monthly.reduce((sum, row) => sum + row.movements, 0);

  return (
    <section className="ship-statistics" aria-label="Estatísticas de movimentos de navios">
      <header className="ship-statistics__intro">
        <div>
          <span className="eyebrow"><BarChart3 size={15} aria-hidden="true" /> Movimento portuário</span>
          <h2>Navios porta-contentores em 2026</h2>
          <p>{data.sourceNote}</p>
        </div>
        <a className="ship-statistics__download" href="/documents/movimentacao-navios-2026-profissional.xlsx" download>
          <ArrowDownToLine size={17} aria-hidden="true" />
          <span>Descarregar Excel</span>
        </a>
      </header>

      <div className="ship-statistics__kpis">
        <article>
          <span>Escalas no resumo</span>
          <strong>{number(monthlyMovements)}</strong>
          <small>Janeiro a Maio</small>
        </article>
        <article>
          <span>Contentores desembarcados</span>
          <strong>{number(monthlyDischarged)}</strong>
          <small>Total do resumo mensal</small>
        </article>
        <article>
          <span>Contentores embarcados</span>
          <strong>{number(monthlyLoaded)}</strong>
          <small>Total do resumo mensal</small>
        </article>
        <article>
          <span>Movimentos detalhados</span>
          <strong>{number(data.detailed.length)}</strong>
          <small>Inclui o registo de Junho</small>
        </article>
      </div>

      <section className="ship-statistics__section">
        <div className="ship-statistics__section-heading">
          <div>
            <span className="eyebrow"><Ship size={15} aria-hidden="true" /> Síntese</span>
            <h3>Resumo mensal</h3>
          </div>
          <p>Contentores movimentados por mês segundo a folha de resumo recebida.</p>
        </div>
        <div className="ship-statistics__table-wrap">
          <table>
            <thead><tr><th>Mês</th><th>Movimentos</th><th>Desembarcados</th><th>Embarcados</th><th>Total</th></tr></thead>
            <tbody>
              {monthlyRows.map((row) => (
                <tr key={row.period}><th scope="row">{row.period}</th><td>{number(row.movements)}</td><td>{number(row.discharged)}</td><td>{number(row.loaded)}</td><td>{number(row.total)}</td></tr>
              ))}
              <tr className="is-total"><th scope="row">Total do resumo</th><td>{number(monthlyMovements)}</td><td>{number(monthlyDischarged)}</td><td>{number(monthlyLoaded)}</td><td>{number(monthlyDischarged + monthlyLoaded)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="ship-statistics__section">
        <div className="ship-statistics__section-heading">
          <div><span className="eyebrow">Por dimensão e estado</span><h3>Detalhe mensal dos contentores</h3></div>
          <p>Os totais distinguem contentores cheios, vazios e filetes nos sentidos de desembarque e embarque.</p>
        </div>
        <div className="ship-statistics__table-wrap">
          <table className="ship-statistics__wide-table">
            <thead><tr><th>Mês</th><th>Desc. 20 cheio</th><th>Desc. 40 cheio</th><th>Desc. 45 cheio</th><th>Desc. 20 vazio</th><th>Desc. 40 vazio</th><th>Desc. 45 vazio</th><th>Desc. filetes</th><th>Desc. total</th><th>Emb. 20 cheio</th><th>Emb. 40 cheio</th><th>Emb. 45 cheio</th><th>Emb. 20 vazio</th><th>Emb. 40 vazio</th><th>Emb. 45 vazio</th><th>Emb. filetes</th><th>Emb. total</th></tr></thead>
            <tbody>{data.monthly.map((row) => (
              <tr key={row.period}>
                <th scope="row">{row.period}</th><td>{number(row.discharged20Full)}</td><td>{number(row.discharged40Full)}</td><td>{number(row.discharged45Full)}</td><td>{number(row.discharged20Empty)}</td><td>{number(row.discharged40Empty)}</td><td>{number(row.discharged45Empty)}</td><td>{number(row.dischargedFiletes)}</td><td>{number(row.discharged)}</td><td>{number(row.loaded20Full)}</td><td>{number(row.loaded40Full)}</td><td>{number(row.loaded45Full)}</td><td>{number(row.loaded20Empty)}</td><td>{number(row.loaded40Empty)}</td><td>{number(row.loaded45Empty)}</td><td>{number(row.loadedFiletes)}</td><td>{number(row.loaded)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="ship-statistics__section ship-statistics__summary-grid">
        <div>
          <div className="ship-statistics__section-heading"><div><span className="eyebrow">Janeiro a Março</span><h3>Resumo trimestral</h3></div></div>
          <div className="ship-statistics__table-wrap"><table><thead><tr><th>Período</th><th>Desembarcados</th><th>Embarcados</th><th>Total</th></tr></thead><tbody>{data.quarterly.map((row) => <tr key={row.period} className={row.period.includes("Total") ? "is-total" : undefined}><th scope="row">{row.period}</th><td>{number(row.discharged)}</td><td>{number(row.loaded)}</td><td>{number(total(row))}</td></tr>)}</tbody></table></div>
        </div>
        <div>
          <div className="ship-statistics__section-heading"><div><span className="eyebrow">Estrutura do ano</span><h3>Resumo semestral</h3></div></div>
          <div className="ship-statistics__table-wrap"><table><thead><tr><th>Período</th><th>Desembarcados</th><th>Embarcados</th><th>Estado</th></tr></thead><tbody>{data.semesters.map((row) => <tr key={row.period} className={row.period.includes("Total") ? "is-total" : undefined}><th scope="row">{row.period}</th><td>{number(row.discharged)}</td><td>{number(row.loaded)}</td><td>{row.status}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section className="ship-statistics__section">
        <div className="ship-statistics__section-heading"><div><span className="eyebrow">Fecho da fonte</span><h3>Resumo anual</h3></div><p>O segundo semestre aparece com valor zero no documento recebido e foi mantido assim.</p></div>
        <div className="ship-statistics__table-wrap"><table><thead><tr><th>Período</th><th>Desembarcados</th><th>Embarcados</th><th>Total</th><th>Estado</th></tr></thead><tbody>{data.annual.map((row) => <tr key={row.period} className={row.period.includes("Total") ? "is-total" : undefined}><th scope="row">{row.period}</th><td>{number(row.discharged)}</td><td>{number(row.loaded)}</td><td>{number(total(row))}</td><td>{row.status}</td></tr>)}</tbody></table></div>
      </section>

      <section className="ship-statistics__section">
        <div className="ship-statistics__section-heading"><div><span className="eyebrow">Registo operacional</span><h3>Movimentos detalhados</h3></div><p>A tabela apresenta todos os movimentos encontrados na folha de detalhe. O ficheiro Excel contém também a discriminação completa por contentor.</p></div>
        <div className="ship-statistics__table-wrap"><table><thead><tr><th>Data</th><th>Navio</th><th>C/M</th><th>Afretador</th><th>Desembarcados</th><th>Embarcados</th><th>Autos LIG</th><th>Autos PES</th></tr></thead><tbody>{data.detailed.map((row) => <tr key={`${row.date}-${row.movement}`}><td>{row.date}</td><th scope="row">{row.vessel}</th><td>{row.movement}</td><td>{row.charterer}</td><td>{number(row.discharged)}</td><td>{number(row.loaded)}</td><td>{number(row.autosLig)}</td><td>{number(row.autosPes)}</td></tr>)}</tbody></table></div>
      </section>
    </section>
  );
}
