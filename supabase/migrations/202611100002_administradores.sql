create table public.administradores (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null check (char_length(nome) between 2 and 60),
  nome_normalizado text unique not null check (nome_normalizado <> 'admin'),
  criado_em timestamptz not null default now()
);

alter table public.administradores enable row level security;
revoke all on public.administradores from anon, authenticated;
grant select, insert on public.administradores to service_role;
