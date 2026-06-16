import {
  Archive,
  Database,
  FileUp,
  Languages,
  LockKeyhole,
  LogOut,
  Pencil,
  Plus,
  Server,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getAdminSession, isAdminConfigured } from "@/server/auth";
import { getContentRepository } from "@/server/content/repository";
import type { ContentItem } from "@/server/content/types";
import { getProviderConfiguration } from "@/server/providers";
import {
  archiveContentAction,
  createContentAction,
  loginAction,
  logoutAction,
  removeContentAction,
  removeMediaAction,
  updateContentAction,
  updateMediaAction,
  updateProfileAction,
  uploadAction,
} from "./actions";
import { getMediaRepository } from "@/server/media/repository";

type AdminProps = {
  searchParams: Promise<{ editar?: string; erro?: string; estado?: string }>;
};

export default async function AdminPage({ searchParams }: AdminProps) {
  const query = await searchParams;
  const configured = isAdminConfigured();
  const identity = configured ? await getAdminSession() : null;

  if (!identity) return <Login configured={configured} error={query.erro} />;

  const providers = getProviderConfiguration();
  const repository = getContentRepository();
  const items = await repository.list();
  const media = await getMediaRepository().list();
  const editing = query.editar ? await repository.getById(query.editar) : null;
  const published = items.filter((item) => item.status === "published").length;
  const drafts = items.filter((item) => item.status === "draft").length;
  const archived = items.filter((item) => item.status === "archived").length;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/pt" className="admin-brand">
          <Image src="/media/logo-apgb.png" alt="" width={104} height={40} unoptimized />
          <span>Portal APGB</span>
        </Link>
        <nav>
          <a href="#visao-geral" className="is-active">Visão geral</a>
          <a href="#perfil">Perfil</a>
          <a href="#conteudos">Conteúdos</a>
          <a href="#editor">{editing ? "Editar conteúdo" : "Novo conteúdo"}</a>
          <a href="#ficheiros">Biblioteca</a>
        </nav>
        <div className="admin-user">
          <strong>{identity.name}</strong>
          <span>{identity.email} · {identity.role}</span>
        </div>
        <form action={logoutAction}>
          <button type="submit"><LogOut size={16} aria-hidden="true" />Terminar sessão</button>
        </form>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div><span>Administração</span><h1>Gestão editorial</h1></div>
          <Link href="/pt">Ver site público</Link>
        </header>

        {query.estado && <p className="admin-notice">Operação concluída: {query.estado.replaceAll("-", " ")}.</p>}
        {query.erro === "perfil-password" && <p className="admin-error">A confirmação da palavra-passe não corresponde.</p>}

        <section id="visao-geral" className="admin-section">
          <div className="admin-section__heading">
            <div><h2>Visão geral</h2><p>Conteúdo e serviços activos neste ambiente.</p></div>
          </div>
          <div className="provider-grid">
            <ProviderCard icon={ShieldCheck} label="Publicados" value={String(published)} />
            <ProviderCard icon={Pencil} label="Rascunhos" value={String(drafts)} />
            <ProviderCard icon={Archive} label="Arquivados" value={String(archived)} />
            <ProviderCard icon={Database} label="Conteúdos" value={providers.content} />
          </div>
          <div className="provider-line">
            <span><Server size={15} /> Ficheiros: {providers.storage}</span>
            <span><Languages size={15} /> Tradução: {providers.translation}</span>
          </div>
        </section>

        <section id="perfil" className="admin-section">
          <div className="admin-section__heading">
            <div><h2>Perfil</h2><p>Dados da conta administrativa em sessão.</p></div>
            <UserRound size={22} aria-hidden="true" />
          </div>
          <form action={updateProfileAction} className="admin-form">
            <label>Nome apresentado<input name="name" required minLength={2} defaultValue={identity.name} /></label>
            <label>Email<input value={identity.email} readOnly /></label>
            <label>Papel<input value={identity.role} readOnly /></label>
            <label>Nova palavra-passe<input type="password" name="password" minLength={10} autoComplete="new-password" /></label>
            <label>Confirmar palavra-passe<input type="password" name="passwordConfirm" minLength={10} autoComplete="new-password" /></label>
            <button type="submit" className="admin-primary">Guardar perfil</button>
          </form>
        </section>

        <section id="conteudos" className="admin-section">
          <div className="admin-section__heading">
            <div><h2>Conteúdos</h2><p>{items.length} registos disponíveis para gestão.</p></div>
            <Link className="admin-primary" href="/admin#editor"><Plus size={16} /> Novo conteúdo</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Título</th><th>Tipo</th><th>Estado</th><th>Actualização</th><th>Acções</th></tr></thead>
              <tbody>
                {items.length ? items.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{pt(item).title}</strong><small>{item.section} / {item.slug}</small></td>
                    <td>{item.type}</td>
                    <td><span className={`status status--${item.status}`}>{item.status}</span></td>
                    <td>{new Intl.DateTimeFormat("pt-PT").format(new Date(item.updatedAt))}</td>
                    <td><div className="admin-actions">
                      <Link href={`/admin?editar=${item.id}#editor`} aria-label={`Editar ${pt(item).title}`}><Pencil size={15} /></Link>
                      {identity.role === "admin" && <>
                        <form action={archiveContentAction}><input type="hidden" name="id" value={item.id} /><button aria-label={`Arquivar ${pt(item).title}`}><Archive size={15} /></button></form>
                        <form action={removeContentAction}><input type="hidden" name="id" value={item.id} /><button aria-label={`Remover ${pt(item).title}`}><Trash2 size={15} /></button></form>
                      </>}
                    </div></td>
                  </tr>
                )) : <tr><td colSpan={5}>Ainda não existem conteúdos dinâmicos.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section id="editor" className="admin-section">
          <div className="admin-section__heading">
            <div>
              <h2>{editing ? "Editar conteúdo" : "Novo conteúdo"}</h2>
              <p>O português fica disponível de imediato. Use títulos `##` para dividir o corpo em secções.</p>
            </div>
            {editing ? <Link href="/admin#editor">Cancelar edição</Link> : <Plus size={22} aria-hidden="true" />}
          </div>
          <ContentForm item={editing} />
        </section>

        <section id="ficheiros" className="admin-section">
          <div className="admin-section__heading">
            <div><h2>Carregar ficheiro</h2><p>Fotografias e documentos até 25 MB por ficheiro.</p></div>
            <FileUp size={22} aria-hidden="true" />
          </div>
          <form action={uploadAction} className="admin-form admin-upload-form">
            <label>Título<input name="title" placeholder="Título público do ficheiro" /></label>
            <label>Texto alternativo<input name="altText" placeholder="Descrição acessível da fotografia" /></label>
            <label className="is-wide">Ficheiro<input type="file" name="file" accept="image/*,.pdf,.doc,.docx" required /></label>
            <button type="submit" className="admin-primary">Carregar para a biblioteca</button>
          </form>
          <div className="media-grid">
            {media.map((item) => <article key={item.id}>
              {item.kind === "image" ? <Image src={item.url} alt={item.altText} width={320} height={180} unoptimized /> : <div className="media-document"><FileUp size={28} /><span>{item.contentType}</span></div>}
              <form action={updateMediaAction}>
                <input type="hidden" name="id" value={item.id} />
                <label>Título<input name="title" defaultValue={item.title} required /></label>
                <label>Texto alternativo<input name="altText" defaultValue={item.altText} /></label>
                <code>{item.url}</code>
                <button className="admin-primary">Guardar metadados</button>
              </form>
              {identity.role === "admin" && <form action={removeMediaAction} className="media-remove">
                <input type="hidden" name="id" value={item.id} />
                <button><Trash2 size={14} /> Remover registo</button>
              </form>}
            </article>)}
          </div>
        </section>
      </div>
    </main>
  );
}

function ContentForm({ item }: { item: ContentItem | null }) {
  const source = item ? pt(item) : null;
  return (
    <form action={item ? updateContentAction : createContentAction} className="admin-form">
      {item && <input type="hidden" name="id" value={item.id} />}
      <label>Tipo<select name="type" defaultValue={item?.type || "news"}>{types.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label>Estado<select name="status" defaultValue={item?.status || "draft"}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label>
      <label>Secção<input name="section" required pattern="[a-z0-9-]+" defaultValue={item?.section || "autoridade-portuaria"} /></label>
      <label>Identificador da página<input name="slug" required pattern="[a-z0-9-]+" defaultValue={item?.slug} placeholder="exemplo-de-noticia" /></label>
      <label className="is-wide">Título<input name="title" required minLength={3} defaultValue={source?.title} /></label>
      <label className="is-wide">Resumo<textarea name="summary" required minLength={10} rows={3} defaultValue={source?.summary} /></label>
      <label className="is-wide">Conteúdo Markdown<textarea name="body" required minLength={10} rows={12} defaultValue={source?.body} /></label>
      <label className="is-wide">URL da imagem de capa<input name="heroImage" defaultValue={item?.heroImage || ""} placeholder="/uploads/2026/imagem.webp" /></label>
      <label className="is-wide">Texto alternativo da capa<input name="heroAlt" defaultValue={item?.heroAlt || ""} /></label>
      <label className="is-wide">Fotografias da galeria, uma URL por linha<textarea name="galleryUrls" rows={4} defaultValue={item?.galleryUrls.join("\n")} /></label>
      <label className="is-wide">Documentos, uma URL por linha<textarea name="documentUrls" rows={4} defaultValue={item?.documentUrls.join("\n")} /></label>
      <label className="admin-checkbox is-wide"><input type="checkbox" name="featured" defaultChecked={item?.featured} />Destacar no portal</label>
      <label className="admin-checkbox is-wide"><input type="checkbox" name="translate" defaultChecked={!item} />Traduzir automaticamente para francês e inglês</label>
      <button type="submit" className="admin-primary">{item ? "Guardar alterações" : "Criar conteúdo"}</button>
    </form>
  );
}

function pt(item: ContentItem) {
  return item.translations.find((translation) => translation.locale === "pt") || item.translations[0] || { title: item.slug, summary: "", body: "" };
}

const types = [
  ["news", "Notícia"], ["page", "Página"], ["project", "Projecto"],
  ["notice", "Aviso"], ["document", "Documento"], ["gallery", "Galeria"],
] as const;

function ProviderCard({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) {
  return <article><Icon size={20} aria-hidden="true" /><span>{label}</span><strong>{value}</strong><small>Activo</small></article>;
}

function Login({ configured, error }: { configured: boolean; error?: string }) {
  return (
    <main className="admin-login"><section>
      <Link href="/pt" className="admin-brand"><Image src="/media/logo-apgb.png" alt="" width={126} height={48} unoptimized /><span>Portal APGB</span></Link>
      <LockKeyhole size={28} aria-hidden="true" /><h1>Acesso administrativo</h1>
      {configured ? <>
        <p>Introduza o email e a palavra-passe da equipa responsável pelo portal.</p>
        {error && <p className="admin-error">Credenciais inválidas.</p>}
        <form action={loginAction}>
          <label>Email<input type="email" name="email" autoComplete="username" /></label>
          <label>Palavra-passe<input type="password" name="password" required autoComplete="current-password" /></label>
          <button type="submit" className="admin-primary">Entrar</button>
        </form>
      </> : <div className="admin-setup"><strong>Configuração necessária</strong><p>Defina `AUTH_DRIVER`, `AUTH_SECRET` e as credenciais do adaptador no alojamento.</p></div>}
    </section></main>
  );
}
