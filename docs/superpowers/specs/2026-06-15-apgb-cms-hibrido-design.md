# CMS Híbrido do Portal APGB

Data: 15 de Junho de 2026

## Objectivo

Transformar o painel administrativo existente num CMS editorial integrado no portal APGB. A equipa autorizada deve conseguir criar, editar, publicar, arquivar e remover notícias, páginas, projectos, fotografias e documentos sem alterar código.

O portal mantém uma única aplicação Next.js. Na Vercel, os adaptadores ligam ao Supabase. No cPanel, os mesmos contratos ligam à MariaDB e ao disco local.

## Princípios

- O conteúdo institucional actual permanece como base segura no repositório.
- O conteúdo editorial guardado na base de dados substitui a base através do `slug`.
- O site público nunca lê directamente formulários ou dados sem validação.
- O português fica disponível de imediato.
- Francês e inglês recebem tradução automática quando o serviço está configurado. Caso contrário, apresentam o conteúdo português.
- A estrutura visual, os componentes e os estilos continuam protegidos no código.
- O painel gere conteúdo e ficheiros. Não expõe edição livre de CSS, JavaScript ou componentes.
- Todas as operações editoriais sensíveis exigem sessão autenticada e autorização por papel.

## Âmbito da Primeira Versão

### Incluído

- autenticação por email e palavra-passe
- papéis `admin` e `editor`
- criação e edição de páginas, notícias, projectos, avisos e documentos
- publicação, rascunho e arquivo
- remoção lógica de conteúdos
- edição de título, resumo, corpo, secção, imagem de capa, data e estado
- associação de fotografias e documentos a conteúdos
- biblioteca de ficheiros
- substituição dinâmica do conteúdo institucional por `slug`
- criação de novas páginas públicas
- histórico de versões antes de cada alteração
- publicação em português com tradução automática opcional
- adaptadores para Supabase e MariaDB
- painel responsivo

### Fora do Âmbito Inicial

- construtor visual livre de páginas por arrastar e largar
- edição de menus principais pelo painel
- edição de estilos, componentes ou código
- fluxo de aprovação com mais de dois níveis
- comentários públicos
- newsletter
- análise estatística avançada

Estas funções ficam fora da primeira versão porque aumentam o risco operacional e não são necessárias para gerir o conteúdo actual.

## Arquitectura

### Resolução Híbrida de Conteúdo

O ficheiro `src/content/pages.ts` continua a fornecer as páginas institucionais de base. Uma nova camada assíncrona consulta o repositório editorial antes de apresentar uma página.

Fluxo público:

1. A rota recebe o `slug` e o idioma.
2. O serviço editorial procura um registo dinâmico com esse `slug`.
3. Se existir uma versão publicada, converte-a para o formato público e substitui a página de base.
4. Se existir um registo arquivado ou removido, a página deixa de estar acessível.
5. Se não existir registo dinâmico, o portal apresenta a página de base.
6. Se a tradução pedida não estiver disponível, apresenta português com a nota já existente.

Uma nova página criada no painel não precisa de existir em `pages.ts`. A rota dinâmica apresenta-a através da secção escolhida.

### Contratos Portáteis

O `ContentRepository` passa a suportar:

- listar com filtros
- obter por ID
- obter por slug
- criar
- actualizar
- arquivar
- remover logicamente
- guardar versão anterior

O `MediaRepository` passa a suportar:

- listar imagens e documentos
- registar ficheiro carregado
- actualizar título e texto alternativo
- remover metadados e ficheiro quando permitido

O `AuthProvider` passa a suportar:

- autenticar por email e palavra-passe
- devolver identidade e papel
- criar e validar sessão
- terminar sessão

Cada contrato terá implementação local, Supabase e MariaDB quando aplicável.

## Modelo Editorial

### Conteúdo

Cada item editorial guarda:

- `id`
- `type`
- `slug`
- `section`
- `status`
- `hero_media_id`
- `published_at`
- `deleted_at`
- `created_by`
- `updated_by`
- datas de criação e actualização

### Traduções

Cada idioma guarda:

- título
- resumo
- corpo
- estado da tradução

O corpo usa Markdown restrito. Esta decisão mantém a edição simples, portátil e segura. O portal converte Markdown para blocos visuais controlados. HTML arbitrário não será aceite.

### Relações de Ficheiros

Uma tabela de relações liga conteúdos a ficheiros com um papel:

- `hero`
- `gallery`
- `document`

Cada relação guarda ordem. Isto permite escolher uma imagem de capa, ordenar galerias e associar documentos.

### Versões

Antes de actualizar, arquivar ou remover um conteúdo, o sistema guarda um snapshot em `content_versions`. A primeira versão do painel mostra o histórico e permite consultar o snapshot. A reposição automática de versões fica preparada no contrato, mas não entra na interface inicial.

## Autenticação e Autorização

### Supabase

Na Vercel, o login usa Supabase Auth com email e palavra-passe. O papel fica em `app_metadata`, nunca em `user_metadata`. O servidor valida a identidade e cria a sessão administrativa segura.

### MariaDB

No cPanel, a tabela `admin_users` guarda email, nome, papel, estado e hash de palavra-passe com `scrypt`. A sessão usa cookie assinado, `httpOnly`, `sameSite=lax` e `secure` em produção.

### Papéis

| Papel | Permissões |
| --- | --- |
| `admin` | acesso total, arquivo, remoção, gestão de ficheiros e futuros utilizadores |
| `editor` | criar, editar e publicar conteúdos e carregar ficheiros |

Cada Server Action e Route Handler volta a validar sessão e papel. A protecção visual do painel não substitui a autorização no servidor.

## Painel Administrativo

### Navegação

O painel terá as áreas:

- Visão geral
- Conteúdos
- Novo conteúdo
- Biblioteca
- Definições técnicas

### Visão Geral

Apresenta:

- quantidade de conteúdos publicados, rascunhos e arquivados
- quantidade de fotografias e documentos
- publicações recentes
- estado dos adaptadores activos

### Lista de Conteúdos

A lista permite:

- filtrar por tipo, estado e secção
- procurar por título ou slug
- abrir edição
- arquivar
- remover logicamente
- abrir a página pública quando publicada

### Editor

O formulário de criação e edição inclui:

- tipo
- secção
- título
- slug
- resumo
- corpo Markdown
- imagem de capa
- fotografias da galeria
- documentos
- data de publicação
- estado
- opção de tradução automática

O formulário apresenta uma pré-visualização simples do conteúdo antes da publicação.

### Biblioteca

A biblioteca permite:

- carregar imagens e documentos até ao limite configurado
- consultar miniatura, nome, tipo e tamanho
- editar título e texto alternativo
- seleccionar ficheiros nos formulários editoriais
- remover ficheiros sem relações activas

## Integração com o Site Público

As páginas públicas passam a resolver conteúdo através de um serviço único. `HomeView`, `ContentView`, metadata e rotas deixam de depender exclusivamente de `getPageBySlug`.

Os conteúdos dinâmicos respeitam a estrutura visual actual:

- imagem de capa no hero
- título e resumo
- corpo em secções controladas
- documentos
- galeria
- conteúdos relacionados pela secção

A página inicial continua configurada no código nesta fase. Notícias e projectos criados no CMS podem entrar automaticamente em “Informação em destaque” e “Projectos prioritários” através de um campo `featured`.

## Bases de Dados

### Supabase

A migration existente será ampliada com:

- novos campos em `content_items`
- `content_media`
- `admin_profiles`
- índices para `slug`, estado, secção e publicação
- políticas RLS

As tabelas públicas mantêm leitura limitada a conteúdos publicados. Escrita administrativa ocorre no servidor. O `service_role` nunca chega ao browser.

### MariaDB

O schema equivalente inclui:

- os mesmos campos editoriais
- `content_media`
- `admin_users`
- índices e chaves estrangeiras equivalentes

O armazenamento local usa `public/uploads`. O caminho permanece configurável para permitir mover ficheiros para uma pasta persistente do cPanel.

## Tratamento de Erros

- formulários usam validação Zod no servidor
- slugs duplicados apresentam mensagem clara
- ficheiros inválidos ou acima do limite são rejeitados antes de guardar metadados
- falha de tradução não bloqueia publicação em português
- falha ao guardar uma relação de ficheiro reverte a operação editorial
- uma página dinâmica inválida não substitui a página de base
- o painel apresenta mensagens de operação sem expor erros internos ou segredos

## Segurança

- palavras-passe nunca são guardadas em texto simples
- cookies administrativos são `httpOnly`
- cada mutação valida sessão e papel
- uploads validam extensão, MIME, tamanho e nome gerado pelo servidor
- HTML arbitrário não entra no corpo editorial
- remoção de conteúdo é lógica
- remoção física de ficheiros exige ausência de relações
- RLS fica activa nas tabelas expostas do Supabase
- logs e respostas não expõem chaves ou configuração

## Testes e Verificação

Serão adicionados testes para:

- resolução de conteúdo dinâmico sobre a base
- fallback para página institucional
- ocultação de conteúdo arquivado ou removido
- CRUD dos repositórios
- autorização de administrador e editor
- validação dos formulários
- associação e ordenação de ficheiros
- fallback de tradução
- rotas públicas criadas pelo CMS

Antes da publicação serão executados:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- validação visual do login, painel, editor, biblioteca e páginas públicas em desktop e mobile

## Migração e Activação

A implementação será activada por adaptador.

1. O modo local serve para desenvolvimento e testes.
2. O Supabase recebe a migration e as variáveis da Vercel.
3. O conteúdo institucional continua disponível mesmo antes de existir conteúdo dinâmico.
4. O cPanel recebe o schema MariaDB e a configuração de armazenamento local quando ocorrer a migração.

Não será feita uma importação automática de todas as páginas institucionais para a base de dados nesta fase. O administrador edita uma página existente ao criar a primeira substituição dinâmica para o mesmo `slug`.

## Critérios de Aceitação

- um administrador entra com email e palavra-passe
- um editor autorizado cria uma notícia com imagem e publica-a
- a notícia aparece no site público sem alteração de código
- uma página institucional editada no painel substitui a versão de base
- uma página arquivada deixa de aparecer publicamente
- uma nova página criada no painel abre pela rota da secção escolhida
- fotografias e documentos carregados ficam disponíveis na biblioteca
- o mesmo código funciona com adaptador local, Supabase ou MariaDB
- português permanece disponível quando a tradução falha
- testes, typecheck, lint e build passam
