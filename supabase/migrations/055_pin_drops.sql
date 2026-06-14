create table if not exists public.pin_drops (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  location     text not null,
  caption      text,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);

create table if not exists public.pin_drop_joins (
  id           uuid primary key default gen_random_uuid(),
  pin_id       uuid references public.pin_drops(id) on delete cascade not null,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  joined_at    timestamptz not null default now(),
  unique(pin_id, user_id)
);

alter table public.pin_drops enable row level security;
alter table public.pin_drop_joins enable row level security;

-- Members can see all active pins
create policy "members_read_pins" on public.pin_drops
  for select using (expires_at > now());
-- Members insert their own pins
create policy "members_insert_pins" on public.pin_drops
  for insert with check (auth.uid() = user_id);
-- Members can join pins
create policy "members_join_pins" on public.pin_drop_joins
  for insert with check (auth.uid() = user_id);
create policy "members_read_joins" on public.pin_drop_joins
  for select using (true);
