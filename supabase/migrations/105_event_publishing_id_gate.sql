-- Event publishing gate: government ID verification required to go live
-- Any verified member can draft; only gov-ID-verified members can publish live.

-- gov_id_verification_status on profiles (separate from membership verification_status)
alter table public.profiles
  add column if not exists gov_id_verification_status text not null default 'not_submitted'
    check (gov_id_verification_status in ('not_submitted','pending','verified','rejected'));

-- publish_status on the events table (tracks draft → live lifecycle)
alter table public.events
  add column if not exists publish_status text not null default 'draft'
    check (publish_status in ('draft','pending_id_verification','pending_review','live','cancelled'));

-- creator_user_id as a named alias for admin queries
-- (events already has created_by; add generated column only if missing)
alter table public.events
  add column if not exists creator_user_id uuid references auth.users(id);

-- backfill creator_user_id from created_by where possible
update public.events set creator_user_id = created_by where creator_user_id is null and created_by is not null;

-- Audit log for event lifecycle actions
create table if not exists public.event_audit_log (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references public.events(id) on delete cascade,
  user_id    uuid        not null,
  action     text        not null
    check (action in ('event_created','event_published','event_updated','event_cancelled')),
  meta       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists event_audit_log_event_idx
  on public.event_audit_log (event_id, created_at desc);
create index if not exists event_audit_log_user_idx
  on public.event_audit_log (user_id, created_at desc);

alter table public.event_audit_log enable row level security;

-- Admins can read all audit entries (via service role); members can read their own
create policy if not exists "Members read own audit log"
  on public.event_audit_log for select
  using (auth.uid() = user_id);

-- Index to let admins quickly find all events by creator
create index if not exists events_creator_user_id_idx
  on public.events (creator_user_id, created_at desc);
