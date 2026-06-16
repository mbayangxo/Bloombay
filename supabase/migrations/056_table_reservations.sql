create table if not exists public.table_reservations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  restaurant_id text not null,
  restaurant_name text not null,
  date          date not null,
  time          text not null,          -- "7:00 PM"
  party_size    integer not null default 2,
  notes         text,
  status        text not null default 'pending',  -- pending | confirmed | cancelled | seated
  confirmed_at  timestamptz,
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists table_reservations_user_id_idx on public.table_reservations(user_id);
create index if not exists table_reservations_restaurant_id_idx on public.table_reservations(restaurant_id);
create index if not exists table_reservations_date_idx on public.table_reservations(date);

alter table public.table_reservations enable row level security;

-- Users can read their own reservations
create policy "users_read_own_reservations" on public.table_reservations
  for select using (auth.uid() = user_id);
-- Users can create reservations
create policy "users_insert_reservations" on public.table_reservations
  for insert with check (auth.uid() = user_id);
-- Service role manages all
create policy "service_manages_reservations" on public.table_reservations
  for all using (true) with check (true);
