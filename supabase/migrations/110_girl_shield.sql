-- Girl Shield: real Safe Check-In enforcement + live location sharing with
-- your bouquet. Replaces the old check-in timer, which only ever lived in
-- local React state and never actually notified anyone.

-- ── Safe Check-In ──────────────────────────────────────────────────────────
-- A member starts a timer; if she doesn't mark herself safe before it expires,
-- the safety-monitor cron pings her bouquet for real (reuses safety_pings).
create table if not exists public.safe_checkins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  event_name    text,
  contact_name  text,
  contact_phone text,
  expires_at    timestamptz not null,
  resolved_at   timestamptz,
  overdue_pinged boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists safe_checkins_overdue_idx
  on public.safe_checkins(expires_at) where resolved_at is null;
create index if not exists safe_checkins_user_idx
  on public.safe_checkins(user_id, created_at desc);

alter table public.safe_checkins enable row level security;

create policy "safe_checkins_read_own"
  on public.safe_checkins for select using (auth.uid() = user_id);

create policy "safe_checkins_create_own"
  on public.safe_checkins for insert with check (auth.uid() = user_id);

create policy "safe_checkins_resolve_own"
  on public.safe_checkins for update using (auth.uid() = user_id);

-- ── Live location sharing (opt-in) ────────────────────────────────────────
-- One row per member. Updated continuously while sharing is enabled;
-- visible to anyone in her bouquet (either direction).
create table if not exists public.location_shares (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  enabled     boolean not null default false,
  lat         double precision,
  lng         double precision,
  activity    text,
  updated_at  timestamptz not null default now()
);

alter table public.location_shares enable row level security;

create policy "location_shares_read_own_or_bouquet"
  on public.location_shares for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.bloom_bouquet b
      where (b.owner_id = auth.uid() and b.member_id = location_shares.user_id)
         or (b.owner_id = location_shares.user_id and b.member_id = auth.uid())
    )
  );

create policy "location_shares_upsert_own"
  on public.location_shares for insert with check (auth.uid() = user_id);

create policy "location_shares_update_own"
  on public.location_shares for update using (auth.uid() = user_id);
