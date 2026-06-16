-- 051 — GirlMate standalone user accounts + messaging

-- Flag GirlMate-only users so proxy can route them correctly
alter table public.profiles add column if not exists girlmate_user boolean not null default false;

-- GirlMate direct messages (user contacts listing owner)
create table if not exists public.girlmate_messages (
  id           uuid        primary key default gen_random_uuid(),
  from_user_id uuid        not null references public.profiles(id) on delete cascade,
  to_user_id   uuid        not null references public.profiles(id) on delete cascade,
  listing_id   uuid        references public.girlmate_profiles(id) on delete set null,
  body         text        not null,
  read         boolean     not null default false,
  created_at   timestamptz not null default now()
);

alter table public.girlmate_messages enable row level security;

create policy "gm_messages_read" on public.girlmate_messages
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "gm_messages_send" on public.girlmate_messages
  for insert with check (auth.uid() = from_user_id);

create policy "gm_messages_mark_read" on public.girlmate_messages
  for update using (auth.uid() = to_user_id)
  with check (auth.uid() = to_user_id);
