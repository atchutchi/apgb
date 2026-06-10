# Portal Institucional APGB

## Objectivo

Construir o portal institucional e operacional da Administração dos Portos da Guiné-Bissau com painel administrativo, três línguas e arquitectura portátil entre Vercel/Supabase e cPanel/MariaDB.

## Estrutura Pública

O menu principal segue o documento fornecido: Home, Autoridade Portuária, Porto de Bissau, Área de Negócio Portuário, Área Social e Projectos. Os títulos vermelhos do documento funcionam como agrupadores internos. Os restantes itens são páginas ou subpáginas.

Cada página recebe uma imagem contextual do acervo. A galeria publica todas as fotografias únicas. Documentos duplicados e páginas soltas de documentos compostos não são apresentados duas vezes.

## Conteúdos

Os documentos Word fornecem os textos de caracterização, historial, estrutura, estratégia, missão, projectos e informação portuária. Os PDF ficam disponíveis para consulta e descarga. Tarifas, organigramas e diagramas são apresentados como imagens e documentos.

Os conteúdos fornecidos são tratados como informação actual. Cada página mostra a data de actualização e o painel mantém histórico de versões.

## Línguas

Português é a língua original. Após publicação, um processo tenta criar automaticamente francês e inglês através da DeepL API Free. Quando a tradução falha ou o limite termina, o português continua disponível e o painel assinala as traduções pendentes.

## Administração

O painel permite autenticação, publicação e edição de páginas, notícias, documentos, projectos, fotografias, estatísticas e informação operacional. O painel mostra estado de publicação, traduções, data de actualização e histórico.

## Arquitectura

A aplicação usa Next.js App Router com saída `standalone`. As interfaces `ContentRepository`, `StorageProvider`, `AuthProvider` e `TranslationProvider` isolam a aplicação da infraestrutura.

Na Vercel, os adaptadores ligam ao Supabase Database e Storage. No cPanel, ligam à MariaDB e ao disco local. Em desenvolvimento, existe um adaptador local com conteúdo inicial.

## Dados

O modelo central inclui conteúdos, traduções, media, documentos, utilizadores administrativos, sessões e histórico. Conteúdos usam tipos e metadados estruturados para permitir novas páginas sem alterar a base.

## Segurança

O painel usa sessões HTTP-only, validação no servidor, limitação de tentativas de autenticação e protecção de rotas. Uploads validam tipo e tamanho. Chaves secretas nunca chegam ao cliente. Políticas RLS protegem tabelas e ficheiros no Supabase.

## Verificação

O projecto deve passar testes unitários, lint, build, testes de acessibilidade e verificação visual responsiva. O deployment Vercel é promovido depois da validação do preview.

