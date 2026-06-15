-- 061 · event memories + gathering photos ─────────────────────────────────────

-- Yande-generated one-line memory for each gathering
create table if not exists public.event_memories (
  id           uuid primary key default gen_random_uuid(),
  gathering_id uuid not null unique references public.gatherings(id) on delete cascade,
  memory_text  text not null,
  created_at   timestamptz not null default now()
);

alter table public.event_memories enable row level security;

create policy "memories_read_all"
  on public.event_memories for select using (true);

-- service role inserts (cron / yande); regular users cannot write directly
create policy "memories_service_insert"
  on public.event_memories for insert with check (true);

create index if not exists event_memories_gathering_idx on public.event_memories(gathering_id);

-- Photos that attendees upload for a gathering (shown on host profile)
create table if not exists public.gathering_photos (
  id           uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  url          text not null,
  caption      text,
  created_at   timestamptz not null default now()
);

alter table public.gathering_photos enable row level security;

create policy "photos_read_all"
  on public.gathering_photos for select using (true);

create policy "photos_insert_own"
  on public.gathering_photos for insert with check (auth.uid() = user_id);

create policy "photos_delete_own"
  on public.gathering_photos for delete using (auth.uid() = user_id);

create index if not exists gathering_photos_gathering_idx
  on public.gathering_photos(gathering_id, created_at desc);
