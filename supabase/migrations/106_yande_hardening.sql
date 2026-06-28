-- Yande hardening: moderation tasks table + atomic waitlist increment

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

-- Atomic increment for event attending_count (prevents stale-read race conditions)
create or replace function public.increment_attending_count(p_event_id uuid)
returns void
language sql
security definer
as $$
  update public.events
  set attending_count = coalesce(attending_count, 0) + 1
  where id = p_event_id;
$$;
