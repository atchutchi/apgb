import type { LocalizedText } from "@/lib/content";
import { primaryNavigation } from "@/config/navigation";
import { shipStatistics, type ShipStatistics } from "./ship-statistics";

export type ContentBlock = {
  title: LocalizedText;
  text: LocalizedText;
};

export type LeadershipMember = {
  name: LocalizedText;
  role: LocalizedText;
  image?: string;
  alt?: LocalizedText;
};

export type LeadershipGroup = {
  title: LocalizedText;
  members: LeadershipMember[];
};

export type OrganizationNode = {
  title: LocalizedText;
  children?: OrganizationNode[];
  variant?: "primary" | "support" | "service" | "department" | "unit";
};

export type OrganizationChart = {
  title: LocalizedText;
  summary: LocalizedText;
  levels: LocalizedText[];
  governance: OrganizationNode[];
  support: OrganizationNode[];
  services: OrganizationNode[];
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
  leadership?: LeadershipGroup[];
  organization?: OrganizationChart;
  shipStatistics?: ShipStatistics;
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
    "A missão, a visão e as atribuições definem a forma como a APGB serve a economia, a comunidade portuária e o interesse público.",
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
  "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar":
    "A Guiné-Bissau participou, nos dias 13 e 14 de Julho de 2026, no Fórum Internacional sobre o Desenvolvimento Sustentável dos Transportes Marítimos e da Logística na Economia Azul, em Dakar.",
};

const customHeroImages: Record<string, string> = {
  "inicio-trabalhos-dragagem-porto-bissau": "/media/gallery/dragagem-img-9207.webp",
  "mensagem-do-director-geral": "/media/gallery/DG-Felix.webp",
  "quem-somos": "/media/gallery/dsc_3989.webp",
  "missao-visao-valores": "/media/gallery/dsc_3978.webp",
  comunicacao: "/media/gallery/apgb1.webp",
  "comunidade-portuaria": "/media/gallery/apgb2.webp",
  dragagem: "/media/gallery/dragagem-img-9345.webp",
  "posto-medico": "/media/gallery/clinica.webp",
  "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar": "/media/gallery/forum-dakar-delegacao.webp",
};

const customHeroAlts: Record<string, string> = {
  "mensagem-do-director-geral": "Director-Geral da APGB durante uma reunião de trabalho",
  "quem-somos": "Edifício da Administração dos Portos da Guiné-Bissau no Porto de Bissau",
  "missao-visao-valores": "Infra-estruturas do Porto de Bissau",
  comunicacao: "Responsáveis da APGB durante uma comunicação institucional junto ao cais",
  "comunidade-portuaria":
    "Responsáveis da APGB durante uma visita a uma embarcação no Porto de Bissau",
  dragagem: "Equipamento de dragagem no Porto de Bissau",
  "inicio-trabalhos-dragagem-porto-bissau":
    "Faixa institucional do início dos trabalhos de dragagem do Porto de Bissau",
  "posto-medico": "Posto clínico da APGB no recinto portuário",
  "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar":
    "Delegação da Guiné-Bissau no Fórum Internacional sobre os Transportes Marítimos e a Economia Azul, em Dakar",
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
  "posto-medico": ["/media/gallery/clinica.webp"],
  "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar": [
    "/media/gallery/forum-dakar-delegacao.webp",
    "/media/gallery/forum-dakar-sessao-plenaria-1.webp",
    "/media/gallery/forum-dakar-sessao-plenaria-2.webp",
    "/media/gallery/forum-dakar-painel.webp",
  ],
};

const customBlocks: Record<string, ContentBlock[]> = {
  "quem-somos": [
    {
      title: localized("Uma estrutura ao serviço do país"),
      text: localized(
        "A APGB organiza a sua governação entre o Conselho de Administração e a Direcção-Geral. Conheça os responsáveis pelos órgãos de administração e pelas principais áreas de serviço.",
      ),
    },
    {
      title: localized("Identidade e transformação"),
      text: localized(
        "A APGB-ECP é uma empresa de capitais exclusivamente públicos, com natureza de pessoa colectiva de direito público e autonomia administrativa, financeira e patrimonial. A sua transformação foi enquadrada pelo Decreto-Lei n.º 13/2011, de 11 de Outubro, publicado no Boletim Oficial n.º 41.",
      ),
    },
    {
      title: localized("Órgãos estatutários"),
      text: localized(
        "A APGB-ECP é composta pelo Conselho de Administração, pelo Director-Geral e pelo Revisor Oficial de Contas. O Conselho de Administração é composto por um Presidente e dois Vogais e assegura a gestão e o funcionamento da empresa.",
      ),
    },
    {
      title: localized("Apresentação institucional"),
      text: localized(
        "Consulte a apresentação institucional da APGB, com informação sobre a empresa, o seu enquadramento, a missão, as atribuições e a estrutura organizacional.",
      ),
    },
  ],
  "missao-visao-valores": [
    {
      title: localized("Visão"),
      text: localized(
        "Ser uma autoridade portuária moderna, eficiente e sustentável, reconhecida pela qualidade dos serviços, pela segurança das operações e pelo contributo para o desenvolvimento da Guiné-Bissau.",
      ),
    },
    {
      title: localized("Missão"),
      text: localized(
        "Tendo presente o objecto social e as atribuições cometidas à APGB-ECP, a empresa tem a missão de administrar e gerir as infra-estruturas portuárias, assegurando o acesso e a circulação de pessoas e bens por via marítima e terrestre, com qualidade, eficácia, eficiência e racionalidade económica e operacional, contribuindo para o desenvolvimento sustentável da Guiné-Bissau.",
      ),
    },
    {
      title: localized("Valor: Qualidade"),
      text: localized(
        "Procurar a excelência na sua actuação, esforçando-se diariamente por prestar um serviço qualificado, com base nos meios materiais e humanos disponíveis.",
      ),
    },
    {
      title: localized("Valor: Segurança"),
      text: localized(
        "Garantir a segurança da vida humana e a preservação e protecção do ambiente, dos recursos marinhos e dos bens públicos e privados.",
      ),
    },
    {
      title: localized("Valor: Atitude"),
      text: localized(
        "Actuar de forma articulada, com o contributo dos colaboradores e de todos os protagonistas do sector, para cumprir a missão da empresa e satisfazer as expectativas dos utentes do Porto Comercial de Bissau.",
      ),
    },
    {
      title: localized("Valor: Inovação"),
      text: localized(
        "Promover a inovação através de novas tecnologias de informação e comunicação, da criatividade e da proactividade, assegurando um desenvolvimento harmonioso e sustentável da actividade portuária.",
      ),
    },
    {
      title: localized("Atribuições"),
      text: localized(
        "A APGB-ECP tem por objecto gerir os portos da Guiné-Bissau situados na sua área de jurisdição, visando a sua exploração económica, conservação e desenvolvimento, exercendo o papel de operador portuário dos portos públicos.",
      ),
    },
    {
      title: localized("Atribuição A"),
      text: localized(
        "Gerir, administrar e desenvolver os portos e as áreas do domínio público marítimo na sua área de jurisdição, garantindo a eficiência na utilização dos espaços, tanto em área molhada como em terra.",
      ),
    },
    {
      title: localized("Atribuição B"),
      text: localized(
        "Assegurar os serviços relativos ao funcionamento dos portos sob sua dependência, incluindo a assistência aos navios e as garantias de segurança à navegação.",
      ),
    },
    {
      title: localized("Atribuição C"),
      text: localized(
        "Promover a elaboração de estudos, planos e projectos de obras marítimas e terrestres, em conformidade com os planos e programas aprovados.",
      ),
    },
    {
      title: localized("Atribuição D"),
      text: localized(
        "Promover a construção, aquisição, conservação e fiscalização das obras marítimas e terrestres e dos equipamentos flutuantes e terrestres dos portos, bem como a conservação, sinalização, balizagem e dragagem dos fundos e respectivos canais de acesso.",
      ),
    },
  ],
  noticias: [
    {
      title: localized("Informação publicada pela APGB"),
      text: localized(
        "Acompanhe as principais actualizações sobre a actividade da APGB, o Porto de Bissau, as operações portuárias e os projectos de modernização.",
      ),
    },
  ],
  "posto-medico": [
    {
      title: localized("Um espaço de apoio à comunidade portuária"),
      text: localized(
        "O posto clínico é uma infra-estrutura de apoio da APGB destinada a acompanhar as necessidades de saúde e bem-estar associadas à comunidade portuária.",
      ),
    },
    {
      title: localized("Prevenção e proximidade"),
      text: localized(
        "A presença deste espaço reforça a importância da prevenção, do acompanhamento e da resposta de proximidade para quem trabalha e circula no recinto portuário.",
      ),
    },
    {
      title: localized("Informação prática"),
      text: localized(
        "Para informações sobre horários, atendimento e contactos, consulte directamente os serviços da APGB. Os dados serão actualizados nesta página quando forem oficialmente disponibilizados.",
      ),
    },
  ],
  estatutos: [
    {
      title: localized("Resumo do documento"),
      text: localized(
        "O suplemento ao Boletim Oficial n.º 41, de 11 de Outubro de 2011, publica o Decreto-Lei n.º 13/2011 e os Estatutos da Administração dos Portos da Guiné-Bissau, APGB-ecp. O diploma define a natureza jurídica, a sede, o regime e a missão da entidade responsável pela administração, exploração e desenvolvimento dos portos públicos.",
      ),
    },
    {
      title: localized("Organização e competências"),
      text: localized(
        "Os Estatutos estabelecem a tutela do sector marítimo-portuário, a área de exploração e as principais atribuições da APGB. Regulam também o Conselho de Administração, o Director-Geral, o Revisor de Contas, a organização dos serviços, o regime do pessoal, as receitas, os instrumentos de gestão financeira e a prestação de contas.",
      ),
    },
    {
      title: localized("Nota sobre o anexo"),
      text: localized(
        "A secção relativa à APGB começa na página 3 do ficheiro digitalizado. As páginas finais do mesmo suplemento iniciam um diploma separado sobre a Empresa Nacional de Aeroportos da Guiné-Bissau, ENAG-ECP.",
      ),
    },
  ],
  "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar": [
    {
      title: localized("A participação da Guiné-Bissau"),
      text: localized(
        "A República da Guiné-Bissau participou, nos dias 13 e 14 de Julho de 2026, no Fórum Internacional sobre o Desenvolvimento Sustentável dos Transportes Marítimos e da Logística na Economia Azul, realizado no Grande Teatro Nacional de Dakar, República do Senegal.",
      ),
    },
    {
      title: localized("Uma delegação nacional"),
      text: localized(
        "A delegação guineense foi liderada pelo Ministro dos Transportes, Telecomunicações e Economia Digital, Florentino Mendes Pereira, a convite da Organização Marítima da África Ocidental e Central, OMAOC. Integraram igualmente a delegação o Presidente do Instituto Marítimo e Portuário da Guiné-Bissau, Gualdino Afonso Té, e o Director-Geral da Administração dos Portos da Guiné-Bissau, Félix Nandungue.",
      ),
    },
    {
      title: localized("Governação marítima e economia azul"),
      text: localized(
        "A cerimónia de abertura foi presidida pelo Presidente da República do Senegal, Bassirou Diomaye Faye, que saudou a presença da Guiné-Bissau como país irmão. Ao longo dos dois dias, representantes governamentais, autoridades marítimas, organizações internacionais, parceiros de desenvolvimento e especialistas debateram a modernização dos serviços marítimos e da cabotagem, a governação e a segurança marítima, as infra-estruturas portuárias, a indústria naval, a formação, a investigação científica, a digitalização, o financiamento e os corredores verdes.",
      ),
    },
    {
      title: localized("Cooperação e novas parcerias"),
      text: localized(
        "O fórum incluiu uma exposição internacional e sessões de negócios, B2B, criando oportunidades para apresentar soluções, partilhar experiências e estabelecer novas parcerias entre os intervenientes do sector marítimo e portuário.",
      ),
    },
    {
      title: localized("Um compromisso estratégico"),
      text: localized(
        "A participação da Guiné-Bissau reflecte a visão estratégica do Governo para o fortalecimento da economia azul, a modernização das infra-estruturas marítimas e portuárias e o reforço da cooperação regional. Esta orientação contribui para o desenvolvimento sustentável do país e para a promoção da segurança marítima no Golfo da Guiné.",
      ),
    },
  ],
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

const leadershipGroups: LeadershipGroup[] = [
  {
    title: localized("Conselho de Administração"),
    members: [
      {
        name: localized("Dr. Certório Biote"),
        role: localized("Presidente do Conselho de Administração"),
        image: "/media/gallery/Certorio-Biote.webp",
        alt: localized("Dr. Certório Biote, Presidente do Conselho de Administração da APGB"),
      },
      {
        name: localized("Dr. Batista Te"),
        role: localized("Primeiro Vogal"),
      },
      {
        name: localized("Dr. Pansao da Silva"),
        role: localized("Segundo Vogal"),
      },
    ],
  },
  {
    title: localized("Direcção-Geral e Direcções de Serviço"),
    members: [
      {
        name: localized("Dr. Felix B. Nandungue"),
        role: localized("Director-Geral"),
        image: "/media/gallery/DG-Felix.webp",
        alt: localized("Dr. Felix B. Nandungue, Director-Geral da APGB"),
      },
      {
        name: localized("Dr. Quintino da Silva Co"),
        role: localized("Director Comercial"),
        image: "/media/gallery/Quintino-da-Silva-Co.webp",
        alt: localized("Dr. Quintino da Silva Co, Director Comercial da APGB"),
      },
      {
        name: localized("Dr. Mamadu Lamine Sane"),
        role: localized("Director dos Estudos e Planeamento"),
        image: "/media/gallery/Dr-Mamadu-Lamine-Sane.webp",
        alt: localized("Dr. Mamadu Lamine Sane, Director dos Estudos e Planeamento da APGB"),
      },
      {
        name: localized("Dr. Naio Brandão Vieira Té"),
        role: localized("Director Financeiro"),
        image: "/media/gallery/Naio-Brandão-Vieira-Té.webp",
        alt: localized("Dr. Naio Brandão Vieira Té, Director Financeiro da APGB"),
      },
      {
        name: localized("Dr. Domingos Brito"),
        role: localized("Director Administrativo dos Recursos Humanos"),
        image: "/media/gallery/Domingos-Brito.webp",
        alt: localized("Dr. Domingos Brito, Director Administrativo dos Recursos Humanos da APGB"),
      },
      {
        name: localized("Dr. Martinho Fiefe"),
        role: localized("Director das Operações Portuárias"),
        image: "/media/gallery/Dr-Martinho-Fiefe.webp",
        alt: localized("Dr. Martinho Fiefe, Director das Operações Portuárias da APGB"),
      },
      {
        name: localized("Eng. Virgilio Carlos A. Medina"),
        role: localized("Director das Infra-estruturas e Equipamento Portuários"),
        image: "/media/gallery/Virgilio-Carlos-A-Medina.webp",
        alt: localized("Eng. Virgilio Carlos A. Medina, Director das Infra-estruturas e Equipamentos Portuários da APGB"),
      },
      {
        name: localized("Dr. Nixon Sousa"),
        role: localized("Director do Gabinete de Auditoria e Controlo Interno"),
        image: "/media/gallery/Dr-Nixon-Sousa.webp",
        alt: localized("Dr. Nixon Sousa, Director do Gabinete de Auditoria e Controlo Interno da APGB"),
      },
    ],
  },
];

const organizationChart: OrganizationChart = {
  title: localized("Estrutura orgânica da APGB-ECP"),
  summary: localized(
    "A organização da APGB-ECP distribui responsabilidades entre os órgãos de governação, as áreas de apoio técnico e as cinco direcções de serviços.",
  ),
  levels: [
    localized("Área de Governação de Negócio"),
    localized("Área de Fiscalização de Negócio"),
    localized("Área de Gestão de Negócio"),
    localized("Área de Apoio Técnico à Gestão"),
    localized("Área de Desenvolvimento de Negócio"),
  ],
  governance: [
    { title: localized("Conselho de Administração"), variant: "primary" },
    { title: localized("Revisor Oficial de Contas"), variant: "support" },
    { title: localized("Director-Geral"), variant: "primary" },
  ],
  support: [
    { title: localized("Controlo Interno"), variant: "support" },
    { title: localized("Prevenção e Segurança Portuária"), variant: "support" },
    { title: localized("Gabinete Jurídico"), variant: "support" },
    { title: localized("Gabinete de Estudos e Planeamento"), variant: "support" },
    { title: localized("Gabinete de Assessoria Técnica"), variant: "support" },
    { title: localized("Tecnologia de Informação e Comunicação"), variant: "support" },
  ],
  services: [
    {
      title: localized("Direcção de Serviços Administrativos e dos Recursos Humanos"),
      variant: "service",
      children: [
        {
          title: localized("Departamento Administrativo e de Recursos Humanos"),
          variant: "department",
          children: [
            { title: localized("Administrativos"), variant: "unit" },
            { title: localized("Recursos Humanos"), variant: "unit" },
            { title: localized("Sócio-laborais"), variant: "unit" },
          ],
        },
      ],
    },
    {
      title: localized("Direcção de Serviços Financeiros"),
      variant: "service",
      children: [
        {
          title: localized("Departamento Financeiro"),
          variant: "department",
          children: [
            { title: localized("Tesouraria"), variant: "unit" },
            { title: localized("Contabilidade"), variant: "unit" },
          ],
        },
      ],
    },
    {
      title: localized("Direcção de Serviços Comercial e Marketing"),
      variant: "service",
      children: [
        {
          title: localized("Departamento Comercial"),
          variant: "department",
          children: [
            { title: localized("Facturação"), variant: "unit" },
            { title: localized("Estatísticas"), variant: "unit" },
            { title: localized("Marketing e Promoção Comercial"), variant: "unit" },
          ],
        },
      ],
    },
    {
      title: localized("Direcção de Serviços de Equipamentos e Infra-estruturas"),
      variant: "service",
      children: [
        {
          title: localized("Departamento de Infra-estruturas e Obras"),
          variant: "department",
          children: [
            { title: localized("Balizagem e Farolagem"), variant: "unit" },
            { title: localized("Dragagem"), variant: "unit" },
          ],
        },
        {
          title: localized("Departamento de Manutenção de Equipamentos"),
          variant: "department",
          children: [
            { title: localized("Mecânico"), variant: "unit" },
            { title: localized("Equipamentos"), variant: "unit" },
          ],
        },
      ],
    },
    {
      title: localized("Direcção de Serviços de Operações Portuárias"),
      variant: "service",
      children: [
        {
          title: localized("Departamento de Operações Portuárias"),
          variant: "department",
          children: [
            { title: localized("Trabalho Portuário"), variant: "unit" },
            { title: localized("Conferência de Cais"), variant: "unit" },
          ],
        },
        {
          title: localized("Departamento de Gestão de Cargas"),
          variant: "department",
          children: [
            { title: localized("Fiscalização e Controlo"), variant: "unit" },
            { title: localized("Parque de Contentores"), variant: "unit" },
            { title: localized("Armazém"), variant: "unit" },
          ],
        },
        {
          title: localized("Departamento de Tráfego Marítimo e Pilotagem"),
          variant: "department",
          children: [
            { title: localized("Marítimos e Tráfego Local"), variant: "unit" },
            { title: localized("Pilotagem de Barra e Práticos"), variant: "unit" },
          ],
        },
      ],
    },
  ],
};

const customDocuments: Record<string, string[]> = {
  "quem-somos": ["/documents/apgb-apresentacao-empresa-setembro-2025.docx"],
  estatutos: [
    "/documents/boletim-oficial-estatutos-apgb-2011.pdf",
    "/documents/estatuto-apgb-compressed-min.pdf",
    "/documents/estatuto-empresa-apgb.pdf",
    "/documents/status-de-l-apgb.pdf",
  ],
  organigrama: [
    "/documents/projecto-organica-apgb-2025.docx",
    "/documents/organigrama.pdf",
    "/documents/organigrama-3.pdf",
  ],
  investimentos: ["/documents/lista-de-projectos-de-investimento-disponiveis-2022.pdf"],
  tarifario: ["/documents/regulamento-tarifas-e-tarifario.pdf"],
  "regulamentos-e-tarifarios": ["/documents/regulamento-tarifas-e-tarifario.pdf"],
  "estatisticas-navios": ["/documents/movimentacao-navios-2026-profissional.xlsx"],
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
    leadership: item.slug === "quem-somos" ? leadershipGroups : undefined,
    organization: item.slug === "organigrama" ? organizationChart : undefined,
    shipStatistics: item.slug === "estatisticas-navios" ? shipStatistics : undefined,
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

pages.push({
  slug: "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar",
  section: "autoridade-portuaria",
  title: localized(
    "Guiné-Bissau participa no Fórum Internacional sobre o Desenvolvimento Sustentável dos Transportes Marítimos e da Logística na Economia Azul, em Dakar",
  ),
  summary: localized(customSummaries["forum-desenvolvimento-sustentavel-transportes-maritimos-dakar"]),
  heroImage: customHeroImages["forum-desenvolvimento-sustentavel-transportes-maritimos-dakar"],
  heroAlt: localized(customHeroAlts["forum-desenvolvimento-sustentavel-transportes-maritimos-dakar"]),
  blocks: customBlocks["forum-desenvolvimento-sustentavel-transportes-maritimos-dakar"],
  galleryUrls: customGalleries["forum-desenvolvimento-sustentavel-transportes-maritimos-dakar"],
  publishedAt: localized("14 de Julho de 2026", "14 juillet 2026", "14 July 2026"),
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
