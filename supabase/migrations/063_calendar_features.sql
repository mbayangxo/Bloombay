-- 063_calendar_features.sql
-- Per-club calendars, recurring events, permanent RSVP, native calendar sync

-- Recurring event support on gatherings
alter table public.gatherings
  add column if not exists is_recurring boolean default false,
  add column if not exists recurrence_type text check (recurrence_type in ('daily','weekly','biweekly','monthly')),
  add column if not exists recurrence_end_date date,
  add column if not exists venue text,
  add column if not exists description text,
  add column if not exists event_type text;

-- Permanent RSVP for recurring events
create table if not exists public.gathering_permanent_rsvp (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, gathering_id)
);
alter table public.gathering_permanent_rsvp enable row level security;
create policy "perm_rsvp_own" on public.gathering_permanent_rsvp
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists perm_rsvp_user_idx on public.gathering_permanent_rsvp (user_id);

-- Club draft/archived status (needed for create flow)
alter table public.clubs
  add column if not exists status text default 'active' check (status in ('draft','active','archived'));
