-- Backfill: safely add columns that exist in Cursor's live schema
-- but may be missing if schema.sql ran before Cursor's migrations.
-- All statements use IF NOT EXISTS — safe to run multiple times.
-- NOTE: does NOT reference color/dark_bg/member_count — those do not
-- exist in the live DB (Cursor's clubs table was created from scratch).

-- ── Clubs: add columns that migration 013 would have created ─────────────────
alter table public.clubs
  add column if not exists slug               text,
  add column if not exists tagline            text,
  add column if not exists welcome_line       text,
  add column if not exists primary_color      text default '#FF1F7D',
  add column if not exists accent_color       text default '#3a0018',
  add column if not exists cover_url          text,
  add column if not exists banner_url         text,
  add column if not exists logo_url           text,
  add column if not exists instagram          text,
  add column if not exists website            text,
  add column if not exists tiktok             text,
  add column if not exists is_paid            boolean default false,
  add column if not exists price_cents        integer default 0,
  add column if not exists member_limit       integer,
  add column if not exists album_urls         jsonb,
  add column if not exists welcome_video_url  text,
  add column if not exists landing_copy       text,
  add column if not exists inside_copy        text,
  add column if not exists logo_typography    text,
  add column if not exists brand_display_mode text;

-- ── Profiles: add full_name if missing ───────────────────────────────────────
alter table public.profiles
  add column if not exists full_name text;

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
