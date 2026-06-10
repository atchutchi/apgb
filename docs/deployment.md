# Publicação do portal APGB

## Arquitectura

O portal usa uma única aplicação Next.js com saída `standalone`. Os serviços são seleccionados por variáveis de ambiente:

- Vercel: `CONTENT_DRIVER=supabase` e `STORAGE_DRIVER=supabase`
- cPanel: `CONTENT_DRIVER=mariadb` e `STORAGE_DRIVER=local`
- Desenvolvimento: `CONTENT_DRIVER=local` e `STORAGE_DRIVER=local`

## Vercel e Supabase

1. Criar um projecto Supabase.
2. Executar `supabase/migrations/20260610140000_initial.sql`.
3. Configurar na Vercel as variáveis documentadas em `.env.example`.
4. Definir `AUTH_SECRET` com pelo menos 32 caracteres aleatórios.
5. Definir uma palavra-passe forte em `ADMIN_PASSWORD`.
6. Publicar o repositório na Vercel.

As tabelas públicas têm RLS activa. Os visitantes lêem unicamente conteúdos publicados. As escritas administrativas usam a chave de serviço no servidor.

## cPanel com MariaDB

1. Criar a base de dados e o utilizador MariaDB.
2. Executar `db/mariadb/schema.sql`.
3. Configurar Node.js 20 ou superior e as variáveis de `.env.example`.
4. Executar `npm ci`, `npm run build` e iniciar `.next/standalone/server.js`.
5. Copiar `.next/static` para `.next/standalone/.next/static` e `public` para `.next/standalone/public`.
6. Garantir escrita da aplicação em `public/uploads` e `data/runtime`.

## Tradução

Com `DEEPL_API_KEY`, novos conteúdos podem ser enviados para DeepL Free. Sem chave, quota ou resposta do serviço, o texto português mantém-se disponível. O sistema nunca bloqueia a publicação do conteúdo original.
