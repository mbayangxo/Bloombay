-- ── Launch Blockers Migration ──────────────────────────────────────────────────
-- 1. Add membership columns to profiles
-- 2. Create member_applications table (waitlist/apply queue)
-- 3. Create wall_posts + wall_post_blooms tables

-- ── 1. Profiles: membership tracking ─────────────────────────────────────────
alter table public.profiles
  add column if not exists is_member            boolean     not null default false,
  add column if not exists membership_started_at timestamptz,
  add column if not exists membership_type       text;       -- 'platform' | null

-- ── 2. Member applications ────────────────────────────────────────────────────
create table if not exists public.member_applications (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete set null,
  email           text,
  name            text        not null,
  first_name      text,
  neighborhood    text,
  age             text,
  city            text        not null default 'New York City',
  bio             text,
  vibe            text,
  goals           text[]      not null default '{}',
  interests       text[]      not null default '{}',
  founding_mother boolean     not null default false,
  photo_url       text,
  status          text        not null default 'pending'
                              check (status in ('pending', 'approved', 'declined')),
  decline_note    text,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     text
);

alter table public.member_applications enable row level security;
-- Only service role can access
create policy "member_apps_service_only"
  on public.member_applications using (false);

create index if not exists member_apps_status_idx
  on public.member_applications (status, submitted_at desc);

-- ── 3. The Wall: posts + blooms ───────────────────────────────────────────────
create table if not exists public.wall_posts (
  id          uuid        primary key default gen_random_uuid(),
  author_id   uuid        not null references public.profiles(id) on delete cascade,
  category    text        not null default 'mood'
              check (category in ('mood', 'connects', 'wins', 'questions', 'rant')),
  text        text        not null,
  blooms      integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.wall_posts enable row level security;

create policy "wall_read_all"
  on public.wall_posts for select using (true);

create policy "wall_insert_own"
  on public.wall_posts for insert with check (auth.uid() = author_id);

create policy "wall_delete_own"
  on public.wall_posts for delete using (auth.uid() = author_id);

-- Bloom reactions
create table if not exists public.wall_post_blooms (
  post_id     uuid        not null references public.wall_posts(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.wall_post_blooms enable row level security;

create policy "wblooms_read_all"
  on public.wall_post_blooms for select using (true);

create policy "wblooms_insert_own"
  on public.wall_post_blooms for insert with check (auth.uid() = user_id);

create policy "wblooms_delete_own"
  on public.wall_post_blooms for delete using (auth.uid() = user_id);

-- Keep denormalized bloom count in sync via triggers
create or replace function public.increment_wall_bloom()
returns trigger language plpgsql security definer as $$
begin
  update public.wall_posts set blooms = blooms + 1 where id = new.post_id;
  return new;
end;
$$;

create or replace function public.decrement_wall_bloom()
returns trigger language plpgsql security definer as $$
begin
  update public.wall_posts set blooms = greatest(0, blooms - 1) where id = old.post_id;
  return old;
end;
$$;

create trigger wall_bloom_up
  after insert on public.wall_post_blooms
  for each row execute function public.increment_wall_bloom();

create trigger wall_bloom_down
  after delete on public.wall_post_blooms
  for each row execute function public.decrement_wall_bloom();

create index if not exists wall_posts_created_idx  on public.wall_posts(created_at desc);
create index if not exists wall_posts_category_idx on public.wall_posts(category, created_at desc);
