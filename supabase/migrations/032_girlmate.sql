create table if not exists public.girlmate_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  neighborhoods text[] not null default '{}',
  budget_min   integer,
  budget_max   integer,
  move_in_date date,
  bio          text,
  lifestyle_tags text[] default '{}',
  pets         boolean default false,
  smoking      boolean default false,
  is_active    boolean default true,
  created_at   timestamptz not null default now(),
  unique (user_id)
);

alter table public.girlmate_profiles enable row level security;
create policy "girlmate_read_active" on public.girlmate_profiles for select using (is_active = true);
create policy "girlmate_write_own"   on public.girlmate_profiles for insert with check (auth.uid() = user_id);
create policy "girlmate_update_own"  on public.girlmate_profiles for update using  (auth.uid() = user_id);
create policy "girlmate_delete_own"  on public.girlmate_profiles for delete using  (auth.uid() = user_id);

create index if not exists girlmate_created_idx on public.girlmate_profiles(created_at desc);
