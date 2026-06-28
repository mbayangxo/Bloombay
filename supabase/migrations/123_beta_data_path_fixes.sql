-- 123_beta_data_path_fixes.sql
-- Beta data-path fixes (launch-blocking).
--
-- Club-selection and paid-club fulfillment are fixed in code against the
-- existing club_memberships(user_id, club_slug) schema — no DDL needed there.
-- This migration adds the two missing tables:
--   1. invites          — onboarding referral invites (was writing to a missing table)
--   2. user_consents     — legal consent log (was never recorded)

-- ── Invites ─────────────────────────────────────────────────────────────────
create table if not exists public.invites (
  id          uuid primary key default gen_random_uuid(),
  inviter_id  uuid not null references auth.users (id) on delete cascade,
  email       text not null,
  status      text not null default 'pending',
  created_at  timestamptz not null default now(),
  unique (inviter_id, email)
);

create index if not exists invites_inviter_idx on public.invites (inviter_id);

alter table public.invites enable row level security;

grant select, insert on public.invites to authenticated;

drop policy if exists "invites insert own" on public.invites;
create policy "invites insert own"
  on public.invites for insert
  to authenticated
  with check (auth.uid() = inviter_id);

drop policy if exists "invites read own" on public.invites;
create policy "invites read own"
  on public.invites for select
  to authenticated
  using (auth.uid() = inviter_id);

-- ── Member consents ─────────────────────────────────────────────────────────
-- One row per (user, consent_type) acceptance. Written server-side only
-- (consent API, service role) so it can capture IP / user-agent.
create table if not exists public.user_consents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  consent_type text not null,
  version      text not null,
  accepted_at  timestamptz not null default now(),
  source       text,
  ip           text,
  user_agent   text
);

create index if not exists user_consents_user_idx on public.user_consents (user_id);
create index if not exists user_consents_type_idx on public.user_consents (user_id, consent_type);

alter table public.user_consents enable row level security;

grant select on public.user_consents to authenticated;

-- Members may read their own consent history. No client insert path:
-- consents are written by the consent API using the service role.
drop policy if exists "user_consents read own" on public.user_consents;
create policy "user_consents read own"
  on public.user_consents for select
  to authenticated
  using (auth.uid() = user_id);
