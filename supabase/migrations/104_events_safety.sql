-- Event safety controls: visibility, category, template type, auto-flag, trusted host

-- Visibility on gatherings table (used by joinEvent / happenings page)
alter table public.gatherings
  add column if not exists visibility   text not null default 'members'
    check (visibility in ('members','club_only','invite_only')),
  add column if not exists event_category text,
  add column if not exists template_type  text;

-- Visibility + safety fields on events table (used by createEvent in happenings.ts)
alter table public.events
  add column if not exists visibility    text not null default 'members'
    check (visibility in ('members','club_only','invite_only')),
  add column if not exists event_category text,
  add column if not exists template_type  text,
  add column if not exists needs_review   boolean not null default false;

-- Trusted host flag on profiles
alter table public.profiles
  add column if not exists is_trusted_host boolean not null default false;

-- Index for admin review queue
create index if not exists events_needs_review_idx on public.events (needs_review, created_at desc)
  where needs_review = true;

-- RLS: only members can see member-visibility events
-- (existing RLS policies on gatherings/events cover is_published; visibility is enforced at app layer for now)
