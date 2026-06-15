-- ── Yande Actions Audit Table ────────────────────────────────────────────────
-- Every action Yande takes is logged here: what, why, who, outcome.
-- This gives full auditability and the data needed to improve her over time.

create table if not exists public.yande_actions (
  id            uuid primary key default gen_random_uuid(),
  agent         text not null,                          -- which Yande agent (community_coordinator, operations, etc.)
  action_type   text not null,                          -- what action (welcome_message, nudge, report, flag, etc.)
  risk_level    text not null default 'low'
    check (risk_level in ('low', 'medium', 'high')),
  status        text not null default 'completed'
    check (status in ('completed', 'pending_approval', 'approved', 'rejected', 'failed')),
  target_user_id uuid references public.profiles(id) on delete set null,
  metadata      jsonb,                                  -- action-specific data (message sent, report content, etc.)
  triggered_by  text,                                   -- 'automatic', 'scheduled', 'admin_request'
  approved_by   uuid references public.profiles(id) on delete set null,
  error_message text,
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz
);

create index if not exists yande_actions_agent_idx    on public.yande_actions(agent, created_at desc);
create index if not exists yande_actions_status_idx   on public.yande_actions(status, created_at desc);
create index if not exists yande_actions_user_idx     on public.yande_actions(target_user_id, created_at desc);

alter table public.yande_actions enable row level security;

-- Admins and founders can read all actions
drop policy if exists "yande_actions_admin_read" on public.yande_actions;
create policy "yande_actions_admin_read"
  on public.yande_actions for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );

-- ── New member welcome tracking ───────────────────────────────────────────────
-- Track which members have received each type of Yande communication
-- so we never double-send

create table if not exists public.yande_member_touches (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  touch_type     text not null,                         -- 'welcome_sms', 'welcome_notification', 'day3_nudge', 'day7_nudge', etc.
  sent_at        timestamptz not null default now(),
  yande_action_id uuid references public.yande_actions(id) on delete set null,
  unique (user_id, touch_type)
);

create index if not exists yande_touches_user_idx on public.yande_member_touches(user_id);

alter table public.yande_member_touches enable row level security;

drop policy if exists "yande_touches_admin" on public.yande_member_touches;
create policy "yande_touches_admin"
  on public.yande_member_touches for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );
