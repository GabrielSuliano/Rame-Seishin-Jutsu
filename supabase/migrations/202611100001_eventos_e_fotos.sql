create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 1 and 120),
  descricao text not null check (char_length(descricao) between 1 and 4000),
  fotos text[] not null default '{}' check (cardinality(fotos) <= 24),
  versao integer not null default 1,
  criado_em timestamptz not null default now()
);

create index eventos_criado_em_idx on public.eventos (criado_em desc, id);

create table public.fotos_site (
  identificador text primary key check (identificador in ('foto1', 'foto2', 'foto3', 'foto4')),
  caminho text not null
);

alter table public.eventos enable row level security;
alter table public.fotos_site enable row level security;
revoke all on public.eventos, public.fotos_site from anon, authenticated;
grant select, insert, update, delete on public.eventos, public.fotos_site to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-rame', 'fotos-rame', true, 6291456, array['image/webp']);
