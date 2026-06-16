import type { LocalizedText } from "@/lib/content";
import { primaryNavigation } from "@/config/navigation";

export type ContentBlock = {
  title: LocalizedText;
  text: LocalizedText;
};

export type PageContent = {
  slug: string;
  section: string;
  title: LocalizedText;
  summary: LocalizedText;
  heroImage: string;
  heroAlt: LocalizedText;
  blocks: ContentBlock[];
  documentUrls?: string[];
  galleryUrls?: string[];
  publishedAt?: LocalizedText;
  featured?: boolean;
  menuItems?: Array<{
    slug: string;
    label: LocalizedText;
    summary: LocalizedText;
  }>;
};

const localized = (pt: string, fr?: string, en?: string): LocalizedText => ({
  pt,
  fr: fr || pt,
  en: en || pt,
});

const imageSets: Record<string, string[]> = {
  home: ["/media/gallery/apgb-hero.png"],
  "autoridade-portuaria": [
    "/media/gallery/dsc_3945.webp",
    "/media/gallery/dsc_3948.webp",
    "/media/gallery/dsc_3950.webp",
    "/media/gallery/apgb1.webp",
    "/media/gallery/dsc_3988.webp",
    "/media/gallery/dsc_3989.webp",
    "/media/gallery/dsc_3990.webp",
    "/media/gallery/dsc_3991.webp",
  ],
  "porto-de-bissau": [
    "/media/gallery/dsc_3965.webp",
    "/media/gallery/dsc_3966.webp",
    "/media/gallery/dsc_3967.webp",
    "/media/gallery/dsc_3968.webp",
    "/media/gallery/dsc_3969.webp",
    "/media/gallery/dsc_3970.webp",
    "/media/gallery/dsc_3971.webp",
    "/media/gallery/dsc_3972.webp",
    "/media/gallery/dsc_3973.webp",
    "/media/gallery/dsc_3974.webp",
    "/media/gallery/dsc_3977.webp",
    "/media/gallery/dsc_3978.webp",
    "/media/gallery/dsc_3979.webp",
    "/media/gallery/dsc_3980.webp",
    "/media/gallery/dsc_3981.webp",
    "/media/gallery/dsc_3982.webp",
  ],
  "negocio-portuario": [
    "/media/gallery/dsc_3999.webp",
    "/media/gallery/dsc_4000.webp",
    "/media/gallery/dsc_3983.webp",
    "/media/gallery/dsc_3984.webp",
    "/media/gallery/dsc_3985.webp",
    "/media/gallery/dsc_3986.webp",
    "/media/gallery/dsc_3987.webp",
  ],
  "area-social": [
    "/media/gallery/dsc_3992.webp",
    "/media/gallery/dsc_3994.webp",
    "/media/gallery/dsc_3995.webp",
  ],
  projectos: [
    "/media/gallery/dsc_3974.webp",
    "/media/gallery/dsc_3977.webp",
    "/media/gallery/dsc_3978.webp",
    "/media/gallery/dsc_3979.webp",
    "/media/gallery/dsc_3980.webp",
    "/media/gallery/dsc_3981.webp",
  ],
};

const sectionDescriptions: Record<string, string> = {
  "autoridade-portuaria":
    "Informação institucional, estratégica e pública da Administração dos Portos da Guiné-Bissau.",
  "porto-de-bissau":
    "Dados, infra-estruturas e informação de referência sobre o Porto de Bissau.",
  "negocio-portuario":
    "Serviços, regras e informação operacional para agentes da comunidade portuária.",
  "area-social":
    "Serviços que protegem a saúde, a segurança e o bem-estar da comunidade portuária.",
  projectos:
    "Intervenções previstas e em curso para modernizar a capacidade portuária nacional.",
};

const customSummaries: Record<string, string> = {
  "": "A APGB administra o Porto de Bissau e trabalha para assegurar uma operação portuária segura, eficiente e ao serviço da economia nacional.",
  "mensagem-do-director-geral":
    "Uma mensagem sobre o compromisso da APGB com a modernização do porto, a qualidade do serviço público e o desenvolvimento da Guiné-Bissau.",
  "quem-somos":
    "A Administração dos Portos da Guiné-Bissau é a autoridade responsável pela gestão, exploração e desenvolvimento dos portos nacionais.",
  estatutos:
    "Consulte os diplomas e documentos que definem a natureza, as atribuições e o funcionamento institucional da APGB.",
  organigrama:
    "Conheça a estrutura orgânica da APGB, as principais áreas de responsabilidade e a relação entre os serviços.",
  "relatorio-anual":
    "Acompanhe a actividade institucional, operacional e financeira da APGB através dos relatórios anuais publicados.",
  "area-de-jurisdicao":
    "Conheça o âmbito territorial e marítimo sob jurisdição da Administração dos Portos da Guiné-Bissau.",
  estatistica:
    "Consulte indicadores institucionais e operacionais que apoiam a transparência, o planeamento e a gestão da APGB.",
  estrategia:
    "A estratégia da APGB orienta a modernização das infra-estruturas, a melhoria da operação e o reforço da segurança portuária.",
  "missao-visao-valores":
    "A missão, a visão e os valores definem a forma como a APGB serve a economia, a comunidade portuária e o interesse público.",
  "objectivos-estrategicos":
    "Os objectivos estratégicos concentram a acção da APGB em eficiência, segurança, sustentabilidade e qualidade do serviço.",
  "avaliacao-ambiental":
    "A APGB integra critérios ambientais no planeamento, na gestão das operações e na preparação dos investimentos portuários.",
  investimentos:
    "Conheça as oportunidades e prioridades de investimento destinadas à modernização do Porto de Bissau.",
  comunicacao:
    "Acompanhe as notícias, os comunicados, os documentos públicos e os canais de contacto da APGB.",
  noticias:
    "Informação actual sobre a actividade da APGB, o Porto de Bissau, a comunidade portuária e os projectos em curso.",
  glossario:
    "Consulte definições simples dos principais termos técnicos usados nas operações marítimas e portuárias.",
  contactos:
    "Encontre a localização, os contactos institucionais e os canais de atendimento da APGB.",
  sugestoes:
    "Envie uma sugestão ou observação para ajudar a APGB a melhorar os seus serviços e a informação pública.",
  caracterizacao:
    "O Porto de Bissau é a principal infra-estrutura portuária nacional e uma ligação essencial para o comércio da Guiné-Bissau.",
  historial:
    "Conheça os momentos que marcaram a evolução do Porto de Bissau e da administração portuária nacional.",
  localizacao:
    "O Porto de Bissau está situado no estuário do rio Geba e liga a capital às rotas marítimas regionais e internacionais.",
  "cais-e-parques":
    "Consulte a informação disponível sobre o cais, as áreas operacionais e os parques de contentores do Porto de Bissau.",
  "plano-de-agua":
    "Informação de referência sobre a organização da área marítima e das zonas operacionais do porto.",
  "parque-de-equipamentos":
    "Conheça os equipamentos que apoiam a movimentação de carga, a operação do cais e a manutenção portuária.",
  estatisticas:
    "Acompanhe indicadores de navios, carga e contentores que ajudam a compreender a actividade do Porto de Bissau.",
  "estatisticas-navios":
    "Consulte os indicadores publicados sobre escalas, tipos de navios e actividade marítima no porto.",
  "estatisticas-carga":
    "Consulte os indicadores publicados sobre mercadorias e volumes de carga movimentados no porto.",
  "estatisticas-contentores":
    "Consulte os indicadores publicados sobre entrada, saída e movimentação de contentores.",
  "comunidade-portuaria":
    "A comunidade portuária reúne entidades públicas, operadores, associações e profissionais ligados ao funcionamento do porto.",
  "entidades-e-associados":
    "Consulte a informação sobre entidades públicas, associações e parceiros que integram a comunidade portuária.",
  "directorio-apgb":
    "Encontre os principais serviços e contactos institucionais da Administração dos Portos da Guiné-Bissau.",
  "aviso-navegacao":
    "Consulte avisos relevantes para a navegação, informação de maré e condições de apoio à actividade marítima.",
  "tabela-de-mare":
    "Consulte a informação de maré disponibilizada para apoiar o planeamento da navegação e das operações.",
  tempo:
    "Acompanhe informação meteorológica de apoio à navegação e à actividade operacional no Porto de Bissau.",
  carga:
    "Informação prática para preparar, entregar, receber e acompanhar carga no Porto de Bissau.",
  "encontrar-contentor":
    "Consulte orientações para localizar e acompanhar contentores no circuito operacional do Porto de Bissau.",
  "entrada-saida-contentor":
    "Conheça os procedimentos de referência para a entrada e a saída de contentores no recinto portuário.",
  "bascula-pesagem":
    "Informação sobre o serviço de pesagem e os procedimentos associados à báscula portuária.",
  "recepcao-exportacao":
    "Consulte os passos de referência para a recepção de contentores destinados à exportação.",
  "anuncio-embarque":
    "Informação de referência para o anúncio e a preparação do embarque de contentores.",
  "regulamentos-e-tarifarios":
    "Consulte regulamentos, tarifas, normas e procedimentos aplicáveis aos serviços portuários.",
  regulamentos:
    "Consulte os documentos regulamentares publicados pela Administração dos Portos da Guiné-Bissau.",
  tarifario:
    "Consulte o regulamento de tarifas e os valores de referência aplicáveis aos serviços portuários.",
  "normas-procedimentos":
    "Conheça as normas e os procedimentos de referência para operar no Porto de Bissau.",
  "regulamento-exploracao":
    "Consulte as regras que orientam a exploração, a organização e o funcionamento das áreas portuárias.",
  navios:
    "Informação operacional destinada a navios, agentes de navegação e restantes intervenientes marítimos.",
  "trafego-portuario":
    "Acompanhe a informação disponível sobre movimentos de navios e organização do tráfego no porto.",
  pilotagem:
    "Consulte informação sobre pilotagem, acesso marítimo e linhas de navegação que servem o Porto de Bissau.",
  "previsao-chegada":
    "Consulte a previsão publicada de chegada de navios ao Porto de Bissau.",
  "navios-ancoradouro":
    "Consulte a informação publicada sobre navios que aguardam autorização ou disponibilidade no ancoradouro.",
  "navios-em-cais":
    "Consulte a informação publicada sobre navios atracados e operações em curso no cais.",
  "seguranca-e-ambiente":
    "A segurança das pessoas, das instalações, dos navios e do ambiente orienta a actividade portuária.",
  "codigo-isps":
    "Conheça a aplicação do Código ISPS na protecção de navios e instalações portuárias.",
  residuos:
    "Consulte orientações sobre recepção, gestão e encaminhamento de resíduos associados à actividade portuária.",
  "posto-medico":
    "O posto médico apoia a saúde ocupacional e a resposta de proximidade dentro da comunidade portuária.",
  "cantina-estiva":
    "A cantina de estiva presta apoio alimentar aos trabalhadores ligados à actividade operacional.",
  "higiene-seguranca":
    "A APGB promove práticas de higiene, prevenção e segurança para proteger quem trabalha no porto.",
  desporto:
    "O desporto reforça a convivência, a saúde e o espírito de equipa entre os trabalhadores da comunidade portuária.",
  "associacao-mulheres-portuarias":
    "A Associação de Mulheres Portuárias promove a participação, a valorização profissional e a defesa dos interesses das mulheres do porto.",
  "velhas-guardas":
    "As Velhas Guardas preservam a memória institucional e reconhecem o contributo dos antigos trabalhadores para a história do porto.",
  sindicato:
    "O Sindicato representa os trabalhadores e contribui para o diálogo social e a melhoria das condições de trabalho.",
  "reabilitacao-modernizacao":
    "Projecto orientado para recuperar equipamentos existentes e melhorar a capacidade operacional do Porto de Bissau.",
  "acessibilidade-maritima":
    "Intervenções destinadas a melhorar o acesso marítimo, incluindo o aprofundamento do cais e do canal de acesso.",
  "ajuda-navegacao":
    "Projecto destinado a reforçar a sinalização e os meios que apoiam uma navegação mais segura.",
  embarcacoes:
    "Projectos de aquisição, recuperação e adequação de embarcações de apoio à actividade portuária.",
  "equipamento-horizontal-vertical":
    "Investimentos em equipamentos de movimentação destinados a aumentar a eficiência das operações portuárias.",
  dragagem:
    "Projecto de melhoria da acessibilidade marítima através da dragagem do Porto de Bissau e do seu canal de acesso.",
  "inicio-trabalhos-dragagem-porto-bissau":
    "A APGB assinalou o início dos trabalhos de dragagem do Porto de Bissau no dia 21 de Janeiro de 2026, sob o lema «Modernizar para Servir Melhor».",
};

const customHeroImages: Record<string, string> = {
  "inicio-trabalhos-dragagem-porto-bissau": "/media/gallery/dragagem-img-9207.webp",
  "mensagem-do-director-geral": "/media/gallery/dsc_4003.webp",
  "quem-somos": "/media/gallery/dsc_3989.webp",
  comunicacao: "/media/gallery/apgb1.webp",
  "comunidade-portuaria": "/media/gallery/apgb2.webp",
  dragagem: "/media/gallery/dragagem-img-9345.webp",
};

const customHeroAlts: Record<string, string> = {
  "mensagem-do-director-geral": "Director-Geral da APGB no seu gabinete",
  "quem-somos": "Edifício da Administração dos Portos da Guiné-Bissau no Porto de Bissau",
  comunicacao: "Responsáveis da APGB durante uma comunicação institucional junto ao cais",
  "comunidade-portuaria":
    "Responsáveis da APGB durante uma visita a uma embarcação no Porto de Bissau",
  dragagem: "Equipamento de dragagem no Porto de Bissau",
  "inicio-trabalhos-dragagem-porto-bissau":
    "Faixa institucional do início dos trabalhos de dragagem do Porto de Bissau",
};

const dredgingGallery = [
  "/media/gallery/dragagem-img-9207.webp",
  "/media/gallery/dragagem-img-9345.webp",
  "/media/gallery/dragagem-img-9638.webp",
  "/media/gallery/dragagem-img-9580.webp",
  "/media/gallery/dragagem-img-9579.webp",
  "/media/gallery/dragagem-img-9565.webp",
  "/media/gallery/dragagem-img-9392.webp",
  "/media/gallery/dragagem-img-9388.webp",
  "/media/gallery/dragagem-img-9507.webp",
  "/media/gallery/dragagem-img-9496.webp",
  "/media/gallery/dragagem-img-9461.webp",
  "/media/gallery/dragagem-img-9426.webp",
  "/media/gallery/dragagem-img-9418.webp",
  "/media/gallery/dragagem-img-9417.webp",
  "/media/gallery/dragagem-img-9408.webp",
  "/media/gallery/dragagem-img-9347.webp",
  "/media/gallery/dragagem-img-9393.webp",
  "/media/gallery/dragagem-img-9384.webp",
  "/media/gallery/dragagem-img-9552.webp",
  "/media/gallery/dragagem-img-9544.webp",
  "/media/gallery/dragagem-img-9209.webp",
  "/media/gallery/dragagem-img-9626.webp",
  "/media/gallery/dragagem-img-9597.webp",
  "/media/gallery/dragagem-img-9245.webp",
];

const customGalleries: Record<string, string[]> = {
  dragagem: dredgingGallery,
  "inicio-trabalhos-dragagem-porto-bissau": dredgingGallery.slice(0, 12),
};

const customBlocks: Record<string, ContentBlock[]> = {
  "mensagem-do-director-geral": [
    {
      title: localized("Mensagem do Director-Geral"),
      text: localized(
        "A Administração dos Portos da Guiné-Bissau assume o compromisso de modernizar o Porto de Bissau, melhorar a qualidade dos serviços e servir o desenvolvimento económico do país. A nossa prioridade é construir uma operação portuária mais segura, eficiente, transparente e próxima dos trabalhadores, operadores e cidadãos.",
      ),
    },
    {
      title: localized("Compromisso institucional"),
      text: localized(
        "Continuaremos a trabalhar com o Governo, a comunidade portuária e os parceiros nacionais e internacionais para reforçar as infra-estruturas, valorizar os recursos humanos e preparar o porto para os desafios do comércio marítimo. Mensagem institucional da Direcção-Geral. © Administração dos Portos da Guiné-Bissau.",
      ),
    },
  ],
  dragagem: [
    {
      title: localized("Enquadramento"),
      text: localized(
        "A dragagem do Porto de Bissau integra o esforço de modernização da principal porta marítima do país. A intervenção melhora as condições de acesso, manobra e segurança para os navios que servem a economia nacional.",
      ),
    },
    {
      title: localized("Objectivos do projecto"),
      text: localized(
        "Os trabalhos destinam-se a recuperar profundidades operacionais, melhorar a acessibilidade marítima e criar condições para uma operação portuária mais regular e eficiente.",
      ),
    },
    {
      title: localized("Modernizar para Servir Melhor"),
      text: localized(
        "O início oficial dos trabalhos foi assinalado no Porto de Bissau em 21 de Janeiro de 2026, com a participação de responsáveis governamentais, dirigentes da APGB, trabalhadores e parceiros do sector.",
      ),
    },
  ],
  "inicio-trabalhos-dragagem-porto-bissau": [
    {
      title: localized("21 de Janeiro de 2026"),
      text: localized(
        "A Administração dos Portos da Guiné-Bissau assinalou o início dos trabalhos de dragagem do Porto de Bissau, uma intervenção central para melhorar a acessibilidade marítima e reforçar a capacidade operacional do porto.",
      ),
    },
    {
      title: localized("Modernizar para Servir Melhor"),
      text: localized(
        "A cerimónia reuniu representantes do Governo, dirigentes e trabalhadores da APGB, parceiros técnicos e membros da comunidade portuária. O projecto reforça o compromisso com um porto mais seguro, eficiente e preparado para responder às necessidades do país.",
      ),
    },
    {
      title: localized("Uma intervenção estratégica"),
      text: localized(
        "A dragagem contribui para melhorar as condições de navegação e manobra, apoiar a regularidade das escalas e criar uma base mais sólida para o crescimento das operações marítimas e comerciais.",
      ),
    },
  ],
};

const customDocuments: Record<string, string[]> = {
  estatutos: [
    "/documents/estatuto-apgb-compressed-min.pdf",
    "/documents/estatuto-empresa-apgb.pdf",
    "/documents/status-de-l-apgb.pdf",
  ],
  organigrama: ["/documents/organigrama.pdf", "/documents/organigrama-3.pdf"],
  investimentos: ["/documents/lista-de-projectos-de-investimento-disponiveis-2022.pdf"],
  tarifario: ["/documents/regulamento-tarifas-e-tarifario.pdf"],
  "regulamentos-e-tarifarios": ["/documents/regulamento-tarifas-e-tarifario.pdf"],
};

const sectionAlt: Record<string, string> = {
  "autoridade-portuaria": "Equipa e responsáveis da APGB no Porto de Bissau",
  "porto-de-bissau": "Infra-estruturas e parque de contentores do Porto de Bissau",
  "negocio-portuario": "Operação marítima e portuária no Porto de Bissau",
  "area-social": "Colaboradores da comunidade portuária da Guiné-Bissau",
  projectos: "Equipa da APGB envolvida na modernização do Porto de Bissau",
};

const sectionHeroImages: Record<string, string> = {
  "autoridade-portuaria": "/media/section-heroes/autoridade-portuaria.webp",
  "porto-de-bissau": "/media/section-heroes/porto-de-bissau.webp",
  "negocio-portuario": "/media/section-heroes/negocio-portuario.webp",
  "area-social": "/media/section-heroes/area-social.webp",
  projectos: "/media/section-heroes/projectos.webp",
};

const sectionCounters: Record<string, number> = {};

function imageFor(section: string): string {
  sectionCounters[section] = (sectionCounters[section] || 0) + 1;
  return sectionHeroImages[section] || sectionHeroImages["porto-de-bissau"];
}

function blocksFor(title: string, section: string): ContentBlock[] {
  const sectionDescription = sectionDescriptions[section] || sectionDescriptions["porto-de-bissau"];
  return [
    {
      title: localized("Enquadramento"),
      text: localized(
        `${title} integra a informação pública disponibilizada pela APGB. ${sectionDescription}`,
      ),
    },
    {
      title: localized("Informação e actualizações"),
      text: localized(
        "Esta página reúne os conteúdos existentes e será actualizada pela equipa responsável sempre que forem publicados novos dados ou documentos.",
      ),
    },
  ];
}

export const pages: PageContent[] = primaryNavigation.flatMap((section) => {
  if (!section.slug) {
    return [
      {
        slug: "",
        section: "home",
        title: localized(
          "Porto de Bissau, porta marítima da Guiné-Bissau",
          "Port de Bissau, porte maritime de la Guinée-Bissau",
          "Port of Bissau, the maritime gateway of Guinea-Bissau",
        ),
        summary: localized(customSummaries[""]),
        heroImage: imageSets.home[0],
        heroAlt: localized("Edifício da Administração dos Portos da Guiné-Bissau"),
        blocks: blocksFor("A Administração dos Portos da Guiné-Bissau", "porto-de-bissau"),
        featured: true,
      },
    ];
  }

  const sectionPage: PageContent = {
    slug: section.slug,
    section: section.slug,
    title: section.label,
    summary: localized(sectionDescriptions[section.slug]),
    heroImage: imageFor(section.slug),
    heroAlt: localized(sectionAlt[section.slug]),
    blocks: [],
    featured: true,
    menuItems: (section.children || [])
      .filter((item) => !item.group)
      .map((item) => ({
        slug: item.slug,
        label: item.label,
        summary: localized(customSummaries[item.slug] || sectionDescriptions[section.slug]),
      })),
  };

  const children = (section.children || []).map<PageContent>((item) => ({
    slug: item.slug,
    section: section.slug,
    title: item.label,
    summary: localized(customSummaries[item.slug] || sectionDescriptions[section.slug]),
    heroImage: customHeroImages[item.slug] || imageFor(section.slug),
    heroAlt: localized(customHeroAlts[item.slug] || sectionAlt[section.slug]),
    blocks: blocksFor(item.label.pt, section.slug),
    documentUrls: customDocuments[item.slug],
    galleryUrls: customGalleries[item.slug],
  }));

  return [sectionPage, ...children];
});

pages.push({
  slug: "inicio-trabalhos-dragagem-porto-bissau",
  section: "autoridade-portuaria",
  title: localized("Início dos Trabalhos de Dragagem do Porto de Bissau"),
  summary: localized(customSummaries["inicio-trabalhos-dragagem-porto-bissau"]),
  heroImage: customHeroImages["inicio-trabalhos-dragagem-porto-bissau"],
  heroAlt: localized(customHeroAlts["inicio-trabalhos-dragagem-porto-bissau"]),
  blocks: customBlocks["inicio-trabalhos-dragagem-porto-bissau"],
  galleryUrls: customGalleries["inicio-trabalhos-dragagem-porto-bissau"],
  publishedAt: localized("21 de Janeiro de 2026", "21 janvier 2026", "21 January 2026"),
  featured: true,
});

for (const page of pages) {
  if (customBlocks[page.slug]) {
    page.blocks = customBlocks[page.slug];
  }
}

export function getPageBySlug(slug: string): PageContent | undefined {
  return pages.find((page) => page.slug === slug);
}
