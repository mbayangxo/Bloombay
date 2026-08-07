-- The City's "Moments" page is meant to be a shared feed of what women are
-- doing around the city right now — but public.moments was built RLS-locked
-- to "read your own only" (a private memory box), so there was never any
-- real data to show and the page was stubbed with fake posts. Open reads to
-- published place/event/meetup moments so the real feed has something to
-- show, and add a real like ("flower") table so hearting a moment persists.

drop policy if exists "moments_read_published" on public.moments;
create policy "moments_read_published"
  on public.moments for select
  to authenticated
  using (status = 'published');

create table if not exists public.moment_flowers (
  id         uuid primary key default gen_random_uuid(),
  moment_id  uuid not null references public.moments(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (moment_id, user_id)
);

create index if not exists moment_flowers_moment_idx on public.moment_flowers(moment_id);

alter table public.moment_flowers enable row level security;

drop policy if exists "moment_flowers_read_all" on public.moment_flowers;
create policy "moment_flowers_read_all"
  on public.moment_flowers for select
  to authenticated
  using (true);

drop policy if exists "moment_flowers_insert_own" on public.moment_flowers;
create policy "moment_flowers_insert_own"
  on public.moment_flowers for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "moment_flowers_delete_own" on public.moment_flowers;
create policy "moment_flowers_delete_own"
  on public.moment_flowers for delete
  to authenticated
  using (auth.uid() = user_id);
