-- Publishing gate: government ID verification required to go live
-- Canonical: gatherings + profiles. Legacy events table applied only if it exists.

-- gov_id_verification_status on profiles (separate from membership verification_status)
alter table public.profiles
  add column if not exists gov_id_verification_status text not null default 'not_submitted'
    check (gov_id_verification_status in ('not_submitted','pending','verified','rejected'));

-- publish_status on gatherings (Club Mama / happenings publish flow)
alter table public.gatherings
  add column if not exists publish_status text not null default 'draft'
    check (publish_status in ('draft','pending_id_verification','pending_review','live','cancelled'));

alter table public.gatherings
  add column if not exists creator_user_id uuid references auth.users(id);

create index if not exists gatherings_publish_status_idx
  on public.gatherings (publish_status, starts_at desc);

create index if not exists gatherings_creator_user_id_idx
  on public.gatherings (creator_user_id, created_at desc);

-- Gathering lifecycle audit log
create table if not exists public.gathering_audit_log (
  id            uuid        primary key default gen_random_uuid(),
  gathering_id  uuid        not null references public.gatherings(id) on delete cascade,
  user_id       uuid        not null,
  action        text        not null
    check (action in ('gathering_created','gathering_published','gathering_updated','gathering_cancelled')),
  meta          jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists gathering_audit_log_gathering_idx
  on public.gathering_audit_log (gathering_id, created_at desc);
create index if not exists gathering_audit_log_user_idx
  on public.gathering_audit_log (user_id, created_at desc);

alter table public.gathering_audit_log enable row level security;

drop policy if exists "Members read own gathering audit log" on public.gathering_audit_log;
create policy "Members read own gathering audit log"
  on public.gathering_audit_log for select
  using (auth.uid() = user_id);

-- Legacy events table (frozen — skip when table does not exist)
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'events'
  ) then
    raise notice '105: skipping legacy events columns — table missing';
    return;
  end if;

  alter table public.events
    add column if not exists publish_status text not null default 'draft',
    add column if not exists creator_user_id uuid references auth.users(id);

  execute $idx$
    create index if not exists events_creator_user_id_idx
      on public.events (creator_user_id, created_at desc)
  $idx$;

  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'event_audit_log'
  ) then
    create table public.event_audit_log (
      id         uuid        primary key default gen_random_uuid(),
      event_id   uuid        not null references public.events(id) on delete cascade,
      user_id    uuid        not null,
      action     text        not null,
      meta       jsonb       not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
    alter table public.event_audit_log enable row level security;
  end if;

  drop policy if exists "Members read own audit log" on public.event_audit_log;
  create policy "Members read own audit log"
    on public.event_audit_log for select
    using (auth.uid() = user_id);
end $$;
