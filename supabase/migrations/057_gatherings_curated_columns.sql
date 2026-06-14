-- Add curated event columns to gatherings table
-- Used by /api/admin/events to import Eventbrite events as BloomBay happenings

alter table public.gatherings
  add column if not exists curated_by_admin boolean not null default false,
  add column if not exists external_source   text,    -- 'eventbrite' | 'manual'
  add column if not exists external_url      text;    -- original event URL

create index if not exists gatherings_curated_idx on public.gatherings(curated_by_admin)
  where curated_by_admin = true;
