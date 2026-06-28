-- Event safety controls: visibility, category, template type, trusted host
-- Canonical IRL table: gatherings (events table is legacy / may not exist).

-- Visibility on gatherings table (used by joinEvent / happenings page)
alter table public.gatherings
  add column if not exists visibility   text not null default 'members'
    check (visibility in ('members','club_only','invite_only')),
  add column if not exists event_category text,
  add column if not exists template_type  text;

-- Legacy events table — apply only if it exists (frozen; no new writes in app)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'events'
  ) then
    alter table public.events
      add column if not exists visibility    text not null default 'members',
      add column if not exists event_category text,
      add column if not exists template_type  text,
      add column if not exists needs_review   boolean not null default false;

    execute $idx$
      create index if not exists events_needs_review_idx
        on public.events (needs_review, created_at desc)
        where needs_review = true
    $idx$;
  end if;
end $$;

-- Trusted host flag on profiles
alter table public.profiles
  add column if not exists is_trusted_host boolean not null default false;

-- RLS: visibility enforced at app layer for now; gatherings use is_published + visibility
