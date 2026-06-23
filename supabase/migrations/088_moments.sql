-- Moments: user memory posts tied to places, events, meetups, or girl gems
-- These go into the user's "memory box" on their profile

create table if not exists public.moments (
  id            uuid        primary key default gen_random_uuid(),
  author_id     uuid        not null references public.profiles(id) on delete cascade,
  template_id   text        not null default 'standard'
                check (template_id in ('standard', 'dual_phone', 'city_note')),
  moment_type   text        not null
                check (moment_type in ('place', 'event', 'meetup', 'gem')),
  caption       text,
  location_name text,
  tagged_friend text,
  photo_urls    text[]      not null default '{}',
  meta          jsonb,
  status        text        not null default 'published'
                check (status in ('published', 'archived')),
  created_at    timestamptz not null default now()
);

create index if not exists moments_author_idx  on public.moments(author_id, created_at desc);
create index if not exists moments_type_idx    on public.moments(moment_type, created_at desc);

alter table public.moments enable row level security;

drop policy if exists "moments_read_own" on public.moments;
create policy "moments_read_own"
  on public.moments for select
  using (auth.uid() = author_id);

drop policy if exists "moments_insert_own" on public.moments;
create policy "moments_insert_own"
  on public.moments for insert
  with check (auth.uid() = author_id);

drop policy if exists "moments_delete_own" on public.moments;
create policy "moments_delete_own"
  on public.moments for delete
  using (auth.uid() = author_id);
