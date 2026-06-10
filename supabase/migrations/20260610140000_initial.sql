create extension if not exists "pgcrypto";

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('page', 'news', 'project', 'document', 'gallery', 'notice')),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  source_locale text not null default 'pt' check (source_locale in ('pt', 'fr', 'en')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  locale text not null check (locale in ('pt', 'fr', 'en')),
  title text not null,
  summary text not null default '',
  body text not null default '',
  translation_status text not null default 'pending'
    check (translation_status in ('source', 'pending', 'translated', 'source-fallback', 'reviewed')),
  updated_at timestamptz not null default now(),
  unique (content_id, locale)
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'document', 'video')),
  title text not null,
  alt_text text not null default '',
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists content_items_status_published_idx
  on public.content_items(status, published_at desc);
create index if not exists content_translations_content_idx
  on public.content_translations(content_id, locale);

alter table public.content_items enable row level security;
alter table public.content_translations enable row level security;
alter table public.media_items enable row level security;
alter table public.content_versions enable row level security;

drop policy if exists "Published content is public" on public.content_items;
create policy "Published content is public"
  on public.content_items for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Published translations are public" on public.content_translations;
create policy "Published translations are public"
  on public.content_translations for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = content_translations.content_id
        and content_items.status = 'published'
    )
  );

drop policy if exists "Media metadata is public" on public.media_items;
create policy "Media metadata is public"
  on public.media_items for select
  to anon, authenticated
  using (true);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.content_items, public.content_translations, public.media_items to anon, authenticated;
grant all on public.content_items, public.content_translations, public.media_items, public.content_versions to service_role;

insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public media is readable" on storage.objects;
create policy "Public media is readable"
  on storage.objects for select
  to public
  using (bucket_id = 'public-media');
