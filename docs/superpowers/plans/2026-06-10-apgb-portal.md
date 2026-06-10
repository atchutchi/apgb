# APGB Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar o portal institucional APGB com conteúdo inicial, três línguas, painel administrativo e adaptadores portáteis.

**Architecture:** Next.js App Router serve o portal e o painel. Repositórios e serviços seleccionados por variáveis de ambiente isolam conteúdo, armazenamento, autenticação e tradução.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Vitest, Playwright, Supabase, MariaDB, DeepL API.

---

### Task 1: Fundação do projecto

**Files:** `package.json`, `src/app/*`, `src/lib/*`, `.env.example`

- [ ] Criar o projecto Next.js com TypeScript, App Router, Tailwind e saída standalone.
- [ ] Instalar Vitest, Testing Library, Playwright, Supabase JS, mysql2, jose, zod e utilitários de interface.
- [ ] Criar testes de configuração para locales, navegação e selecção de adaptadores.
- [ ] Implementar a configuração mínima até os testes passarem.
- [ ] Executar `npm test`, `npm run lint` e `npm run build`.
- [ ] Fazer commit `feat: establish portable portal foundation`.

### Task 2: Conteúdo e activos

**Files:** `scripts/prepare-content.mjs`, `src/content/*`, `public/media/*`, `public/documents/*`

- [ ] Criar teste para o manifesto de imagens e documentos.
- [ ] Gerar WebP responsivo para todas as fotografias únicas.
- [ ] Copiar documentos públicos sem duplicados.
- [ ] Criar conteúdo inicial em português a partir dos documentos fornecidos.
- [ ] Validar que todas as páginas e fotografias estão mapeadas.
- [ ] Fazer commit `feat: import APGB content and media`.

### Task 3: Sistema visual e navegação

**Files:** `src/app/globals.css`, `src/components/site/*`, `src/config/navigation.ts`

- [ ] Criar testes para os seis menus principais e hierarquia interna.
- [ ] Implementar barra governamental, cabeçalho, mega menu, selector de língua e rodapé.
- [ ] Implementar tokens e componentes definidos em `DESIGN.md`.
- [ ] Verificar teclado, foco visível, contraste e navegação móvel.
- [ ] Fazer commit `feat: build institutional site shell`.

### Task 4: Portal público

**Files:** `src/app/[locale]/*`, `src/components/content/*`

- [ ] Criar testes de páginas e fallback linguístico.
- [ ] Implementar página inicial e páginas das cinco áreas principais.
- [ ] Implementar páginas editoriais, documentos, galeria, projectos, tarifas, historial e organigrama.
- [ ] Garantir imagem contextual e data de actualização em cada página.
- [ ] Fazer commit `feat: publish multilingual public portal`.

### Task 5: Serviços portáteis

**Files:** `src/server/content/*`, `src/server/storage/*`, `src/server/translation/*`

- [ ] Criar testes de contrato para repositórios e fornecedores.
- [ ] Implementar adaptador local, Supabase e MariaDB.
- [ ] Implementar armazenamento local e Supabase Storage.
- [ ] Implementar DeepL com fila, fallback português e estados de tradução.
- [ ] Fazer commit `feat: add portable content and storage adapters`.

### Task 6: Painel administrativo

**Files:** `src/app/admin/*`, `src/server/auth/*`, `src/app/api/admin/*`

- [ ] Criar testes de autenticação, autorização e validação.
- [ ] Implementar sessão HTTP-only e protecção do painel.
- [ ] Implementar gestão de notícias, páginas, documentos, fotografias e traduções.
- [ ] Implementar uploads validados e histórico de versões.
- [ ] Fazer commit `feat: add APGB content administration`.

### Task 7: Base de dados e alojamento

**Files:** `supabase/migrations/*`, `database/mariadb.sql`, `Dockerfile`, `docs/deployment/*`

- [ ] Criar migração Supabase com RLS.
- [ ] Criar esquema equivalente MariaDB.
- [ ] Documentar Vercel, Supabase e cPanel Node.js.
- [ ] Verificar configuração standalone e persistência de uploads no cPanel.
- [ ] Fazer commit `chore: prepare Vercel and cPanel deployment`.

### Task 8: Qualidade e publicação

**Files:** `e2e/*`, `README.md`

- [ ] Executar testes unitários e de integração.
- [ ] Executar lint e build de produção.
- [ ] Verificar visualmente desktop e móvel no navegador.
- [ ] Corrigir acessibilidade, hierarquia, espaçamento e imagens.
- [ ] Publicar preview Vercel e validar.
- [ ] Promover a produção e enviar commits para GitHub.

