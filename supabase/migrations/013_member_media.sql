-- Member media: profile photos, club covers, memory uploads
-- Run in Supabase SQL editor after prior migrations.
-- Create storage buckets in Dashboard (or run 014_storage_buckets.sql):
--   avatars, club-media, member-memories, profile-photos (all public read)

-- ── Profile columns used by onboarding + portal ─────────────────────────────

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists bio text,
  add column if not exists borough text,
  add column if not exists avatar_url text,
  add column if not exists verification_photo_url text,
  add column if not exists verification_status text default 'unverified',
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists bloom_points int not null default 0;

-- ── Clubs (Club Mom branding) ───────────────────────────────────────────────

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_id uuid references auth.users (id) on delete set null,
  name text not null,
  cover_url text,
  banner_url text,
  logo_url text,
  tagline text,
  description text,
  welcome_line text,
  primary_color text default '#ff0055',
  accent_color text default '#ffb7ce',
  instagram text,
  website text,
  tiktok text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clubs_owner_id_idx on public.clubs (owner_id);
create index if not exists clubs_slug_idx on public.clubs (slug);

alter table public.clubs enable row level security;

create policy "Clubs public read"
  on public.clubs for select
  using (true);

create policy "Club owners manage own clubs"
  on public.clubs for insert
  with check (auth.uid() = owner_id);

create policy "Club owners update own clubs"
  on public.clubs for update
  using (auth.uid() = owner_id);

-- ── Member memory photos (lounge / vault) ─────────────────────────────────────

create table if not exists public.member_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text not null,
  title text,
  caption text,
  club_slug text,
  created_at timestamptz not null default now()
);

create index if not exists member_memories_user_id_idx on public.member_memories (user_id, created_at desc);

alter table public.member_memories enable row level security;

create policy "Memories public read"
  on public.member_memories for select
  using (true);

create policy "Members insert own memories"
  on public.member_memories for insert
  with check (auth.uid() = user_id);

create policy "Members update own memories"
  on public.member_memories for update
  using (auth.uid() = user_id);

create policy "Members delete own memories"
  on public.member_memories for delete
  using (auth.uid() = user_id);

-- ── Profile gallery photos ───────────────────────────────────────────────────

create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  kind text not null default 'gallery' check (kind in ('avatar', 'gallery')),
  created_at timestamptz not null default now()
);

create index if not exists profile_photos_user_id_idx on public.profile_photos (user_id, sort_order);

alter table public.profile_photos enable row level security;

create policy "Profile photos public read"
  on public.profile_photos for select
  using (true);

create policy "Members insert own profile photos"
  on public.profile_photos for insert
  with check (auth.uid() = user_id);

create policy "Members update own profile photos"
  on public.profile_photos for update
  using (auth.uid() = user_id);

create policy "Members delete own profile photos"
  on public.profile_photos for delete
  using (auth.uid() = user_id);
