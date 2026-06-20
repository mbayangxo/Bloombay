-- Phase 1b: community posts, theme preference, safety reports

alter table public.member_preferences
  add column if not exists theme_preference text not null default 'auto'
    check (theme_preference in ('auto', 'day', 'night'));

alter table public.member_preferences
  add column if not exists yande_payload jsonb not null default '{}'::jsonb;

-- Girlmates / city board posts (Connect)
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  kind text not null check (kind in ('roommate', 'question', 'sublease', 'favor')),
  title text not null,
  neighborhood text,
  city text,
  budget text,
  move_in text,
  body text not null,
  reply_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_idx
  on public.community_posts (created_at desc);

create index if not exists community_posts_kind_idx
  on public.community_posts (kind, created_at desc);

-- Safety & support messages
create table if not exists public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  category text not null check (category in ('support', 'safety', 'billing', 'clubs')),
  body text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists safety_reports_status_idx
  on public.safety_reports (status, created_at desc);

-- Yande memory (optional dedicated table; preferences.yande_payload also used)
create table if not exists public.yande_memory (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;
alter table public.safety_reports enable row level security;
alter table public.yande_memory enable row level security;

create policy "Community posts read authenticated"
  on public.community_posts for select to authenticated
  using (true);

create policy "Community posts insert own"
  on public.community_posts for insert to authenticated
  with check (author_user_id = auth.uid());

create policy "Safety reports insert own"
  on public.safety_reports for insert to authenticated
  with check (user_id is null or user_id = auth.uid());

create policy "Safety reports read ops"
  on public.safety_reports for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create policy "Yande memory own"
  on public.yande_memory for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
