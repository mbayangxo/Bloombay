-- Admin audit trail + moderation case queue (Migration 115)

-- ── Admin audit logs ──────────────────────────────────────────────────────────
create table if not exists public.admin_audit_logs (
  id            uuid        primary key default gen_random_uuid(),
  actor_id      uuid        references public.profiles(id) on delete set null,
  action        text        not null,
  resource_type text,
  resource_id   text,
  before_state  jsonb,
  after_state   jsonb,
  ip_address    text,
  user_agent    text,
  metadata      jsonb       not null default '{}',
  created_at    timestamptz not null default now()
);

create index if not exists admin_audit_logs_actor_idx
  on public.admin_audit_logs (actor_id, created_at desc);

create index if not exists admin_audit_logs_action_idx
  on public.admin_audit_logs (action, created_at desc);

alter table public.admin_audit_logs enable row level security;
-- No policies: service role only; staff read via API with service role.

-- ── Moderation cases ──────────────────────────────────────────────────────────
create table if not exists public.moderation_cases (
  id                  uuid        primary key default gen_random_uuid(),
  source_type         text        not null
    check (source_type in ('member_report', 'user_report', 'content', 'account')),
  source_id           text        not null,
  reported_user_id    uuid        references public.profiles(id) on delete set null,
  reporter_id         uuid        references public.profiles(id) on delete set null,
  severity            text        not null default 'medium'
    check (severity in ('low', 'medium', 'high')),
  status              text        not null default 'pending'
    check (status in ('pending', 'human_review_required', 'in_review', 'resolved', 'dismissed')),
  yande_recommendation text,
  assigned_to         uuid        references public.profiles(id) on delete set null,
  resolved_by         uuid        references public.profiles(id) on delete set null,
  resolved_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists moderation_cases_status_idx
  on public.moderation_cases (status, severity desc, created_at asc);

create index if not exists moderation_cases_reported_idx
  on public.moderation_cases (reported_user_id);

create unique index if not exists moderation_cases_source_unique
  on public.moderation_cases (source_type, source_id)
  where status not in ('resolved', 'dismissed');

alter table public.moderation_cases enable row level security;
-- No policies: service role only; staff read via API with service role.

-- ── member_reports: expand status + reason enums ──────────────────────────────
alter table public.member_reports
  drop constraint if exists member_reports_status_check;

alter table public.member_reports
  add constraint member_reports_status_check
  check (status in (
    'pending', 'reviewed', 'resolved', 'dismissed',
    'human_review_required', 'escalated'
  ));

alter table public.member_reports
  drop constraint if exists member_reports_reason_check;

alter table public.member_reports
  add constraint member_reports_reason_check
  check (reason in (
    'harassment', 'spam', 'inappropriate_content', 'fake_profile',
    'hate_speech', 'scam', 'other'
  ));
