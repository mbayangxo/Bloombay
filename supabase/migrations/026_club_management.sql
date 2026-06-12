-- Club management tables: applications + posts

-- ── Club applications (pending / accepted / rejected) ─────────────────────────
create table if not exists public.club_applications (
  id         uuid primary key default gen_random_uuid(),
  club_id    uuid not null references public.clubs (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  status     text not null default 'pending' check (status in ('pending','accepted','rejected')),
  message    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create index if not exists club_applications_club_idx on public.club_applications (club_id);
create index if not exists club_applications_user_idx on public.club_applications (user_id);
alter table public.club_applications enable row level security;

-- Applicant can insert their own application
create policy "applications_insert_own" on public.club_applications for insert
  with check (auth.uid() = user_id);

-- Applicant can read their own applications
create policy "applications_select_own" on public.club_applications for select
  using (auth.uid() = user_id);

-- Club owner can read + update applications for their clubs
create policy "applications_owner_select" on public.club_applications for select
  using (
    auth.uid() = (select owner_id from public.clubs where id = club_id)
  );

create policy "applications_owner_update" on public.club_applications for update
  using (
    auth.uid() = (select owner_id from public.clubs where id = club_id)
  );

-- ── Club posts (updates from the Club Mama) ──────────────────────────────────
create table if not exists public.club_posts (
  id         uuid primary key default gen_random_uuid(),
  club_id    uuid not null references public.clubs (id) on delete cascade,
  author_id  uuid not null references auth.users (id) on delete cascade,
  body       text not null,
  image_url  text,
  created_at timestamptz not null default now()
);

create index if not exists club_posts_club_idx on public.club_posts (club_id);
alter table public.club_posts enable row level security;

-- Club members and owner can read posts
create policy "posts_select_members" on public.club_posts for select
  using (true);

-- Only author (club mama) can insert
create policy "posts_insert_own" on public.club_posts for insert
  with check (auth.uid() = author_id);

create policy "posts_delete_own" on public.club_posts for delete
  using (auth.uid() = author_id);
