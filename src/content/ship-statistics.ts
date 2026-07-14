export type ShipSummaryRow = {
  period: string;
  movements: number;
  discharged: number;
  loaded: number;
  discharged20Full: number;
  discharged40Full: number;
  discharged45Full: number;
  discharged20Empty: number;
  discharged40Empty: number;
  discharged45Empty: number;
  dischargedFiletes: number;
  loaded20Full: number;
  loaded40Full: number;
  loaded45Full: number;
  loaded20Empty: number;
  loaded40Empty: number;
  loaded45Empty: number;
  loadedFiletes: number;
};

export type DetailedShipMovement = {
  date: string;
  vessel: string;
  movement: string;
  charterer: string;
  discharged: number;
  loaded: number;
  autosLig: number;
  autosPes: number;
};

const summary = (
  period: string,
  movements: number,
  discharged: number,
  loaded: number,
  discharged20Full: number,
  discharged40Full: number,
  discharged45Full: number,
  discharged20Empty: number,
  discharged40Empty: number,
  discharged45Empty: number,
  dischargedFiletes: number,
  loaded20Full: number,
  loaded40Full: number,
  loaded45Full: number,
  loaded20Empty: number,
  loaded40Empty: number,
  loaded45Empty: number,
  loadedFiletes: number,
): ShipSummaryRow => ({
  period,
  movements,
  discharged,
  loaded,
  discharged20Full,
  discharged40Full,
  discharged45Full,
  discharged20Empty,
  discharged40Empty,
  discharged45Empty,
  dischargedFiletes,
  loaded20Full,
  loaded40Full,
  loaded45Full,
  loaded20Empty,
  loaded40Empty,
  loaded45Empty,
  loadedFiletes,
});

export const shipStatistics = {
  sourceNote:
    "O resumo mensal recebido está preenchido de Janeiro a Maio. A folha de detalhe contém 17 movimentos e inclui um registo datado de Junho. Os resumos seguem os totais publicados nas folhas de síntese.",
  monthly: [
    summary("Janeiro", 3, 584, 829, 431, 149, 1, 0, 0, 0, 3, 80, 0, 0, 376, 370, 0, 3),
    summary("Fevereiro", 4, 777, 1059, 497, 216, 40, 0, 0, 0, 24, 42, 62, 0, 614, 317, 0, 24),
    summary("Março", 2, 541, 639, 436, 100, 0, 0, 0, 0, 5, 15, 2, 0, 403, 214, 0, 5),
    summary("Abril", 2, 589, 429, 483, 105, 0, 0, 0, 0, 1, 49, 4, 0, 315, 60, 0, 1),
    summary("Maio", 5, 1526, 1045, 806, 316, 0, 1, 391, 0, 12, 87, 92, 0, 737, 99, 17, 13),
  ] satisfies ShipSummaryRow[],
  quarterly: [
    summary("Janeiro", 0, 584, 829, 431, 149, 1, 0, 0, 0, 3, 80, 0, 0, 376, 370, 0, 3),
    summary("Fevereiro", 0, 777, 1059, 497, 216, 40, 0, 0, 0, 24, 42, 62, 0, 614, 317, 0, 24),
    summary("Março", 0, 541, 639, 436, 100, 0, 0, 0, 0, 5, 15, 2, 0, 403, 214, 0, 5),
    summary("Total do 1º trimestre", 0, 1902, 2527, 1364, 465, 41, 0, 0, 0, 32, 137, 64, 0, 1393, 901, 0, 32),
  ] satisfies ShipSummaryRow[],
  semesters: [
    { period: "1º semestre", discharged: 1902, loaded: 2527, status: "Dados publicados até ao 1º trimestre" },
    { period: "2º semestre", discharged: 0, loaded: 0, status: "Sem movimentos no resumo recebido" },
    { period: "Total anual", discharged: 1902, loaded: 2527, status: "Total da fonte" },
  ],
  annual: [
    { period: "1º semestre", discharged: 1902, loaded: 2527, status: "Registado" },
    { period: "2º semestre", discharged: 0, loaded: 0, status: "Sem dados na fonte" },
    { period: "Total anual", discharged: 1902, loaded: 2527, status: "Total publicado" },
  ],
  detailed: [
    ["02/01/2026", "AURETE - A", "003/2026", "AFRICA PORT", 21, 113, 0, 0],
    ["09/01/2026", "JONATHAN", "005/2026", "AFRICA PORT", 121, 261, 0, 0],
    ["10/01/2026", "FERDINANDA S", "007/2026", "PMAR", 442, 455, 36, 1],
    ["25/01/2026", "LION", "54/2026", "AFRICA PORT", 30, 207, 0, 0],
    ["31/01/2026", "MSC WAVE F", "59/2026", "AGEMAR", 314, 343, 0, 0],
    ["12/02/2026", "AURETTE - A", "79/2026", "AFRICA PORT", 86, 40, 0, 0],
    ["18/02/2026", "RAQUEL S", "80/2026", "PMAR", 347, 469, 41, 20],
    ["04/03/2026", "MSC WAVE F", "90/2026", "AGEMAR", 196, 302, 0, 0],
    ["21/03/2026", "RAQUEL S", "106/2026", "PMAR", 345, 337, 35, 23],
    ["28/03/2026", "MSC WAVE F", "110/2026", "AGEMAR", 250, 220, 0, 0],
    ["12/04/2026", "FERDINANDA S", "114/2026", "PMAR", 339, 209, 43, 10],
    ["02/05/2026", "AURETTE - A", "142/2026", "AFRICA PORT", 179, 100, 0, 0],
    ["07/05/2026", "MSC WAVE F", "145/2026", "AGEMAR BISSAU", 332, 187, 0, 0],
    ["10/05/2026", "FERDINANDA S", "149/2026", "PMAR BISSAU", 390, 426, 30, 12],
    ["20/05/2026", "JOANATHAN", "150/2026", "AFRICA PORT", 248, 49, 0, 0],
    ["30/05/2026", "MSC WAVE F", "157/2026", "AGEMAR", 377, 283, 0, 0],
    ["11/06/2026", "FERDINANDA S", "164/2026", "PMAR", 422, 455, 16, 15],
  ].map(([date, vessel, movement, charterer, discharged, loaded, autosLig, autosPes]) => ({
    date,
    vessel,
    movement,
    charterer,
    discharged,
    loaded,
    autosLig,
    autosPes,
  })) as DetailedShipMovement[],
};

export type ShipStatistics = typeof shipStatistics;
