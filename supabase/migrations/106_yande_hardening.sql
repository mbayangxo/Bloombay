-- Yande hardening: moderation tasks table + atomic attending increment
-- gatherings-only DB: skip legacy events updates (function is safe no-op on gatherings).

-- Human moderation task queue for high-severity Yande actions
create table if not exists public.moderation_tasks (
  id          uuid        primary key default gen_random_uuid(),
  task_type   text        not null,
  subject_id  text        not null,
  priority    text        not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  status      text        not null default 'pending'
    check (status in ('pending', 'in_progress', 'resolved', 'dismissed')),
  metadata    jsonb       not null default '{}',
  assigned_to uuid        references auth.users(id),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists moderation_tasks_status_priority_idx
  on public.moderation_tasks (status, priority desc, created_at asc)
  where status = 'pending';

alter table public.moderation_tasks enable row level security;

-- Only service role can write; admins read via service role

-- Legacy RPC used by lib/yande/operations.ts
-- Canonical IRL table is gatherings (spots_left managed by seat_reservations triggers).
create or replace function public.increment_attending_count(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'events'
  ) then
    update public.events
    set attending_count = coalesce(attending_count, 0) + 1
    where id = p_event_id;
    return;
  end if;

  -- gatherings: attendance tracked via seat_reservations + spots_left trigger (003)
  -- no-op here to avoid double-decrementing spots_left
  return;
end;
$$;
