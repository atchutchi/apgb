import type { LocalizedText } from "@/lib/content";

export type NavigationItem = {
  slug: string;
  label: LocalizedText;
  group?: boolean;
  children?: NavigationItem[];
};

const text = (pt: string, fr?: string, en?: string): LocalizedText => ({
  pt,
  fr: fr || pt,
  en: en || pt,
});

export const primaryNavigation: NavigationItem[] = [
  {
    slug: "",
    label: text("Home", "Accueil", "Home"),
  },
  {
    slug: "autoridade-portuaria",
    label: text(
      "Autoridade Portuária",
      "Autorité Portuaire",
      "Port Authority",
    ),
    children: [
      { slug: "mensagem-do-director-geral", label: text("Mensagem do DG") },
      { slug: "quem-somos", label: text("Quem somos", "Qui sommes-nous", "About us") },
      { slug: "estatutos", label: text("Estatutos da empresa") },
      { slug: "organigrama", label: text("Organigrama", "Organigramme", "Organisation chart") },
      { slug: "relatorio-anual", label: text("Relatório anual") },
      { slug: "area-de-jurisdicao", label: text("Área de jurisdição") },
      {
        slug: "estrategia",
        label: text("Estratégia", "Stratégie", "Strategy"),
        group: true,
      },
      { slug: "missao-visao-valores", label: text("Missão, Visão e Valores") },
      { slug: "objectivos-estrategicos", label: text("Objectivos estratégicos") },
      { slug: "avaliacao-ambiental", label: text("Avaliação ambiental estratégica") },
      { slug: "investimentos", label: text("Investimentos") },
      {
        slug: "comunicacao",
        label: text("Comunicação", "Communication", "Communication"),
        group: true,
      },
      { slug: "noticias", label: text("Notícias", "Actualités", "News") },
      { slug: "glossario", label: text("Glossário de terminologias") },
      { slug: "contactos", label: text("Endereço e contactos") },
      { slug: "sugestoes", label: text("Sugestão", "Suggestion", "Suggestion") },
    ],
  },
  {
    slug: "porto-de-bissau",
    label: text("Porto de Bissau", "Port de Bissau", "Port of Bissau"),
    children: [
      { slug: "caracterizacao", label: text("Caracterização") },
      { slug: "historial", label: text("Historial", "Historique", "History") },
      { slug: "localizacao", label: text("Localização", "Localisation", "Location") },
      { slug: "cais-e-parques", label: text("Cais e parques de contentores") },
      { slug: "plano-de-agua", label: text("Plano de água") },
      { slug: "parque-de-equipamentos", label: text("Parque de equipamentos") },
      {
        slug: "estatisticas",
        label: text("Estatísticas", "Statistiques", "Statistics"),
        group: true,
      },
      { slug: "estatisticas-navios", label: text("Navios", "Navires", "Vessels") },
      { slug: "estatisticas-carga", label: text("Carga", "Cargaison", "Cargo") },
      { slug: "estatisticas-contentores", label: text("Contentores", "Conteneurs", "Containers") },
      {
        slug: "comunidade-portuaria",
        label: text("Comunidade portuária"),
        group: true,
      },
      { slug: "entidades-e-associados", label: text("Entidades públicas e associados") },
      { slug: "directorio-apgb", label: text("Directório APGB") },
      {
        slug: "aviso-navegacao",
        label: text("Aviso à navegação e maré"),
        group: true,
      },
      { slug: "tabela-de-mare", label: text("Tabela de Maré") },
      { slug: "tempo", label: text("Tempo", "Météo", "Weather") },
    ],
  },
  {
    slug: "negocio-portuario",
    label: text(
      "Área de Negócio Portuário",
      "Activités Portuaires",
      "Port Business",
    ),
    children: [
      { slug: "carga", label: text("Carga", "Cargaison", "Cargo"), group: true },
      { slug: "encontrar-contentor", label: text("Encontrar contentor") },
      { slug: "entrada-saida-contentor", label: text("Entrada e saída de contentor") },
      { slug: "bascula-pesagem", label: text("Báscula de pesagem") },
      { slug: "recepcao-exportacao", label: text("Recepção de contentores para exportação") },
      { slug: "anuncio-embarque", label: text("Anúncio de embarque de contentores") },
      {
        slug: "regulamentos-e-tarifarios",
        label: text("Regulamentos e tarifários"),
        group: true,
      },
      { slug: "regulamentos", label: text("Regulamentos") },
      { slug: "tarifario", label: text("Tarifário") },
      { slug: "normas-procedimentos", label: text("Normas e procedimentos") },
      { slug: "regulamento-exploracao", label: text("Regulamento de exploração") },
      { slug: "navios", label: text("Navios", "Navires", "Vessels"), group: true },
      { slug: "trafego-portuario", label: text("Tráfego portuário"), group: true },
      { slug: "pilotagem", label: text("Pilotagem e linhas de navegação") },
      { slug: "previsao-chegada", label: text("Previsão de chegada") },
      { slug: "navios-ancoradouro", label: text("Navios à espera no ancoradouro") },
      { slug: "navios-em-cais", label: text("Navio em cais") },
      {
        slug: "seguranca-e-ambiente",
        label: text("Segurança e ambiente"),
        group: true,
      },
      { slug: "codigo-isps", label: text("Código ISPS") },
      { slug: "residuos", label: text("Resíduos") },
    ],
  },
  {
    slug: "area-social",
    label: text("Área Social", "Espace Social", "Social Area"),
    children: [
      { slug: "posto-medico", label: text("Posto médico") },
      { slug: "cantina-estiva", label: text("Cantina de estiva") },
      { slug: "higiene-seguranca", label: text("Higiene e segurança no trabalho") },
    ],
  },
  {
    slug: "projectos",
    label: text("Projectos", "Projets", "Projects"),
    children: [
      { slug: "reabilitacao-modernizacao", label: text("Reabilitação e modernização de equipamentos") },
      { slug: "acessibilidade-maritima", label: text("Acessibilidade marítima") },
      { slug: "ajuda-navegacao", label: text("Ajuda à navegação") },
      { slug: "embarcacoes", label: text("Embarcações") },
      { slug: "equipamento-horizontal-vertical", label: text("Equipamento horizontal e vertical") },
    ],
  },
];

