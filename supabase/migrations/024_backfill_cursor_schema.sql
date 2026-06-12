-- Backfill: add Cursor's column names to tables that were created by schema.sql
-- Safe to run on either schema — all statements use IF NOT EXISTS.

-- ── Clubs: add Cursor's core columns ─────────────────────────────────────────
alter table public.clubs
  add column if not exists slug              text unique,
  add column if not exists tagline           text,
  add column if not exists welcome_line      text,
  add column if not exists primary_color     text default '#FF1F7D',
  add column if not exists accent_color      text default '#3a0018',
  add column if not exists cover_url         text,
  add column if not exists banner_url        text,
  add column if not exists logo_url          text,
  add column if not exists instagram         text,
  add column if not exists website           text,
  add column if not exists tiktok            text;

-- Back-fill primary_color from color where primary_color is still null
update public.clubs
  set primary_color = color
  where primary_color is null and color is not null;

-- ── Profiles: add full_name alongside first_name ──────────────────────────────
alter table public.profiles
  add column if not exists full_name text;

-- Back-fill full_name from first_name for existing rows
update public.profiles
  set full_name = first_name
  where full_name is null and first_name is not null;

-- ── Club memberships: Cursor's slug-based table ───────────────────────────────
create table if not exists public.club_memberships (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users (id) on delete cascade,
  club_slug text not null,
  joined_at timestamptz not null default now(),
  unique (user_id, club_slug)
);

create index if not exists club_memberships_user_idx on public.club_memberships (user_id);

alter table public.club_memberships enable row level security;

create policy if not exists "Club memberships read own or ops"
  on public.club_memberships for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create policy if not exists "Club memberships insert own"
  on public.club_memberships for insert to authenticated
  with check (user_id = auth.uid());
