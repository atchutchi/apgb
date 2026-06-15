alter table public.content_items add column if not exists section text not null default 'autoridade-portuaria';
alter table public.content_items add column if not exists hero_image text;
alter table public.content_items add column if not exists hero_alt text not null default '';
alter table public.content_items add column if not exists featured boolean not null default false;
alter table public.content_items add column if not exists gallery_urls jsonb not null default '[]'::jsonb;
alter table public.content_items add column if not exists document_urls jsonb not null default '[]'::jsonb;
alter table public.content_items add column if not exists deleted_at timestamptz;

create table if not exists public.content_media (
  content_id uuid not null references public.content_items(id) on delete cascade,
  media_id uuid not null references public.media_items(id) on delete restrict,
  role text not null check (role in ('hero', 'gallery', 'document')),
  position integer not null default 0,
  primary key (content_id, media_id, role)
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'editor' check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_section_idx
  on public.content_items(section, status, published_at desc);
create index if not exists content_media_content_idx
  on public.content_media(content_id, role, position);

alter table public.content_media enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Published content media is public" on public.content_media;
create policy "Published content media is public"
  on public.content_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.content_items
      where content_items.id = content_media.content_id
        and content_items.status = 'published'
        and content_items.deleted_at is null
    )
  );

drop policy if exists "Users read own admin profile" on public.admin_profiles;
create policy "Users read own admin profile"
  on public.admin_profiles for select
  to authenticated
  using (auth.uid() = user_id);

grant select on public.content_media to anon, authenticated;
grant all on public.content_media, public.admin_profiles to service_role;
