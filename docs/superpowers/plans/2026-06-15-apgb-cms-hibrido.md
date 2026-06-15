# APGB CMS Híbrido Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task by task.

**Goal:** Entregar um CMS editorial seguro que substitui conteúdo institucional por `slug`, publica novas páginas e mantém o mesmo código em modo local, Supabase e MariaDB.

**Architecture:** A camada pública consulta primeiro o `ContentRepository` e usa `src/content/pages.ts` como fallback. O painel administrativo usa Server Actions protegidas por sessão e papéis. Os adaptadores persistem o mesmo modelo editorial em ficheiro local, Supabase ou MariaDB.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zod, Vitest, Supabase, MariaDB e armazenamento local/Supabase Storage.

---

## Task 1: Resolução híbrida e modelo editorial

**Files:**
- Modify: `src/server/content/types.ts`
- Modify: `src/server/content/local-repository.ts`
- Create: `src/server/content/local-repository.test.ts`
- Create: `src/server/content/public-content.ts`
- Create: `src/server/content/public-content.test.ts`
- Modify: `src/app/[locale]/[[...segments]]/page.tsx`

- [ ] Escrever testes que exigem obter, actualizar, arquivar e remover logicamente conteúdo local.
- [ ] Confirmar que os testes falham antes da implementação.
- [ ] Expandir o contrato editorial com secção, capa, destaque, relações por URL e remoção lógica.
- [ ] Implementar CRUD e snapshots de versões no adaptador local.
- [ ] Escrever testes para substituição dinâmica, fallback estático, página nova e ocultação.
- [ ] Confirmar que os testes falham antes da implementação.
- [ ] Implementar o serviço público híbrido e converter Markdown restrito em blocos seguros.
- [ ] Ligar metadata e rota pública ao serviço híbrido.
- [ ] Executar testes, typecheck e lint.
- [ ] Commit: `feat: integrar conteudo editorial no portal publico`

## Task 2: Autenticação por email, papéis e CRUD administrativo

**Files:**
- Modify: `src/server/auth.ts`
- Create: `src/server/auth.test.ts`
- Modify: `src/app/admin/actions.ts`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/admin.css`
- Modify: `.env.example`

- [ ] Escrever testes para credenciais locais, identidade de sessão e autorização de `admin` e `editor`.
- [ ] Confirmar que os testes falham antes da implementação.
- [ ] Implementar autenticação local por email e palavra-passe com sessão que guarda identidade e papel.
- [ ] Manter compatibilidade com a configuração administrativa anterior.
- [ ] Criar validação partilhada para criação e actualização editorial.
- [ ] Adicionar acções de editar, publicar, arquivar e remover logicamente.
- [ ] Transformar o painel numa interface de gestão com visão geral, formulário de edição e acções por publicação.
- [ ] Executar testes, typecheck e lint.
- [ ] Commit: `feat: adicionar autenticacao e crud editorial ao painel`

## Task 3: Biblioteca de ficheiros e relações editoriais

**Files:**
- Create: `src/server/media/types.ts`
- Create: `src/server/media/local-repository.ts`
- Create: `src/server/media/local-repository.test.ts`
- Create: `src/server/media/repository.ts`
- Modify: `src/server/storage.ts`
- Modify: `src/app/admin/actions.ts`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/admin.css`

- [ ] Escrever testes para registo, listagem, edição e remoção de metadados locais.
- [ ] Confirmar que os testes falham antes da implementação.
- [ ] Implementar `MediaRepository` local e preparar selecção por URL nos conteúdos.
- [ ] Registar automaticamente uploads na biblioteca.
- [ ] Apresentar a biblioteca no painel com metadados, miniaturas e acções.
- [ ] Permitir associar capa, galeria e documentos no editor.
- [ ] Executar testes, typecheck e lint.
- [ ] Commit: `feat: adicionar biblioteca editorial de ficheiros`

## Task 4: Adaptadores Supabase e MariaDB

**Files:**
- Modify: `src/server/content/supabase-repository.ts`
- Modify: `src/server/content/mariadb-repository.ts`
- Modify: `supabase/migrations/20260610140000_initial.sql`
- Modify: `db/mariadb/schema.sql`

- [ ] Actualizar os adaptadores para o contrato editorial completo.
- [ ] Adicionar campos editoriais, relações, perfis administrativos e índices aos schemas.
- [ ] Garantir leitura pública limitada a conteúdo publicado e não removido.
- [ ] Garantir que escrita administrativa continua restrita ao servidor.
- [ ] Executar testes, typecheck e lint.
- [ ] Commit: `feat: alinhar adaptadores supabase e mariadb com o cms`

## Task 5: README, capturas e validação final

**Files:**
- Modify: `README.md`
- Create: `public/readme/home.png`
- Create: `public/readme/admin-login.png`
- Create: `public/readme/admin-dashboard.png`
- Create: `public/readme/content-page.png`

- [ ] Preparar dados locais temporários para demonstrar publicação e edição.
- [ ] Validar login, painel, publicação e página pública no navegador local.
- [ ] Capturar e guardar ecrãs representativos.
- [ ] Criar README profissional com visão, arquitectura, funcionalidades, configuração, deployment, segurança e testes.
- [ ] Executar `npm test`.
- [ ] Executar `npm run typecheck`.
- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Rever `git diff` e confirmar que não existem segredos ou ficheiros temporários.
- [ ] Commit: `docs: documentar cms e operacao do portal`
- [ ] Fazer push da branch actual para o GitHub.
