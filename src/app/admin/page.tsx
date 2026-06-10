import { Database, FileUp, Languages, LockKeyhole, LogOut, Plus, Server, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getContentRepository } from "@/server/content/repository";
import { getProviderConfiguration } from "@/server/providers";
import { hasAdminSession, isAdminConfigured } from "@/server/auth";
import { createContentAction, loginAction, logoutAction, uploadAction } from "./actions";

type AdminProps = {
  searchParams: Promise<{ erro?: string; estado?: string }>;
};

export default async function AdminPage({ searchParams }: AdminProps) {
  const query = await searchParams;
  const configured = isAdminConfigured();
  const authenticated = configured && (await hasAdminSession());

  if (!authenticated) {
    return <Login configured={configured} error={query.erro} />;
  }

  const providers = getProviderConfiguration();
  const items = await getContentRepository().list();

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/pt" className="admin-brand">
          <Image src="/media/logo-apgb.png" alt="" width={104} height={40} unoptimized />
          <span>Portal APGB</span>
        </Link>
        <nav>
          <a href="#visao-geral" className="is-active">Visão geral</a>
          <a href="#novo-conteudo">Novo conteúdo</a>
          <a href="#ficheiros">Ficheiros</a>
          <a href="#publicacoes">Publicações</a>
        </nav>
        <form action={logoutAction}>
          <button type="submit">
            <LogOut size={16} aria-hidden="true" />
            Terminar sessão
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <span>Administração</span>
            <h1>Gestão do portal</h1>
          </div>
          <Link href="/pt">Ver site público</Link>
        </header>

        {query.estado && <p className="admin-notice">Operação concluída: {query.estado.replaceAll("-", " ")}.</p>}

        <section id="visao-geral" className="admin-section">
          <div className="admin-section__heading">
            <div>
              <h2>Estado dos serviços</h2>
              <p>Configuração activa neste ambiente.</p>
            </div>
          </div>
          <div className="provider-grid">
            <ProviderCard icon={Database} label="Conteúdos" value={providers.content} />
            <ProviderCard icon={Server} label="Ficheiros" value={providers.storage} />
            <ProviderCard icon={Languages} label="Tradução" value={providers.translation} />
            <ProviderCard icon={ShieldCheck} label="Sessão" value="protegida" />
          </div>
        </section>

        <section id="novo-conteudo" className="admin-section">
          <div className="admin-section__heading">
            <div>
              <h2>Publicar conteúdo</h2>
              <p>O português fica disponível de imediato. A tradução automática segue a configuração activa.</p>
            </div>
            <Plus size={22} aria-hidden="true" />
          </div>
          <form action={createContentAction} className="admin-form">
            <label>
              Tipo
              <select name="type" defaultValue="news">
                <option value="news">Notícia</option>
                <option value="page">Página</option>
                <option value="project">Projecto</option>
                <option value="notice">Aviso</option>
                <option value="document">Documento</option>
                <option value="gallery">Galeria</option>
              </select>
            </label>
            <label>
              Estado
              <select name="status" defaultValue="published">
                <option value="published">Publicado</option>
                <option value="draft">Rascunho</option>
                <option value="archived">Arquivado</option>
              </select>
            </label>
            <label className="is-wide">
              Título
              <input name="title" required minLength={3} />
            </label>
            <label className="is-wide">
              Identificador da página
              <input name="slug" required pattern="[a-z0-9-]+" placeholder="exemplo-de-noticia" />
            </label>
            <label className="is-wide">
              Resumo
              <textarea name="summary" required minLength={10} rows={3} />
            </label>
            <label className="is-wide">
              Conteúdo
              <textarea name="body" required minLength={10} rows={8} />
            </label>
            <label className="admin-checkbox is-wide">
              <input type="checkbox" name="translate" defaultChecked />
              Enviar para tradução automática em francês e inglês
            </label>
            <button type="submit" className="admin-primary">Publicar conteúdo</button>
          </form>
        </section>

        <section id="ficheiros" className="admin-section">
          <div className="admin-section__heading">
            <div>
              <h2>Carregar ficheiro</h2>
              <p>Fotografias e documentos até 25 MB por ficheiro.</p>
            </div>
            <FileUp size={22} aria-hidden="true" />
          </div>
          <form action={uploadAction} className="upload-form">
            <input type="file" name="file" accept="image/*,.pdf,.doc,.docx" required />
            <button type="submit" className="admin-primary">Carregar</button>
          </form>
        </section>

        <section id="publicacoes" className="admin-section">
          <div className="admin-section__heading">
            <div>
              <h2>Publicações recentes</h2>
              <p>{items.length} conteúdos guardados no repositório activo.</p>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Actualização</th>
                </tr>
              </thead>
              <tbody>
                {items.length ? items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.translations.find((translation) => translation.locale === "pt")?.title}</td>
                    <td>{item.type}</td>
                    <td><span className={`status status--${item.status}`}>{item.status}</span></td>
                    <td>{new Intl.DateTimeFormat("pt-PT").format(new Date(item.updatedAt))}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4}>Ainda não existem publicações no repositório activo.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProviderCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <article>
      <Icon size={20} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>Activo</small>
    </article>
  );
}

function Login({ configured, error }: { configured: boolean; error?: string }) {
  return (
    <main className="admin-login">
      <section>
        <Link href="/pt" className="admin-brand">
          <Image src="/media/logo-apgb.png" alt="" width={126} height={48} unoptimized />
          <span>Portal APGB</span>
        </Link>
        <LockKeyhole size={28} aria-hidden="true" />
        <h1>Acesso administrativo</h1>
        {configured ? (
          <>
            <p>Introduza a palavra-passe definida para a equipa responsável pelo portal.</p>
            {error && <p className="admin-error">Credenciais inválidas.</p>}
            <form action={loginAction}>
              <label>
                Palavra-passe
                <input type="password" name="password" required autoComplete="current-password" />
              </label>
              <button type="submit" className="admin-primary">Entrar</button>
            </form>
          </>
        ) : (
          <div className="admin-setup">
            <strong>Configuração necessária</strong>
            <p>Defina `ADMIN_PASSWORD` e `AUTH_SECRET` no ambiente de alojamento para activar o painel.</p>
          </div>
        )}
      </section>
    </main>
  );
}
