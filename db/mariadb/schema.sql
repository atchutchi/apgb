create table if not exists content_items (
  id char(36) primary key,
  type enum('page', 'news', 'project', 'document', 'gallery', 'notice') not null,
  slug varchar(160) not null unique,
  status enum('draft', 'published', 'archived') not null default 'draft',
  source_locale enum('pt', 'fr', 'en') not null default 'pt',
  published_at datetime null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  index content_items_status_published_idx (status, published_at)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists content_translations (
  id char(36) primary key,
  content_id char(36) not null,
  locale enum('pt', 'fr', 'en') not null,
  title varchar(240) not null,
  summary text not null,
  body longtext not null,
  translation_status enum('source', 'pending', 'translated', 'source-fallback', 'reviewed') not null default 'pending',
  updated_at datetime not null default current_timestamp on update current_timestamp,
  unique key content_translation_unique (content_id, locale),
  constraint content_translations_content_fk foreign key (content_id)
    references content_items(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists media_items (
  id char(36) primary key,
  kind enum('image', 'document', 'video') not null,
  title varchar(240) not null,
  alt_text text not null,
  storage_path varchar(500) not null unique,
  public_url varchar(1000) not null,
  mime_type varchar(120) not null,
  size_bytes bigint not null default 0,
  created_at datetime not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists content_versions (
  id char(36) primary key,
  content_id char(36) not null,
  snapshot json not null,
  created_at datetime not null default current_timestamp,
  constraint content_versions_content_fk foreign key (content_id)
    references content_items(id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
