create table if not exists public.cases (
  id text primary key,
  age text not null,
  category text not null,
  situation text not null,
  tried text not null,
  outcome text not null,
  outcome_type text not null check (outcome_type in ('worked', 'mixed', 'backfired')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
