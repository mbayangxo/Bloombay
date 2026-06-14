-- User feedback / bug reports
create table if not exists public.user_feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  page_url    text,
  category    text not null default 'bug',  -- 'bug' | 'feature' | 'compliment' | 'other'
  priority    text not null default 'normal', -- 'urgent' | 'normal' | 'low'
  message     text not null,
  device_info text,
  status      text not null default 'open',  -- 'open' | 'in_review' | 'resolved' | 'wont_fix'
  assigned_to text,  -- agent/employee name
  admin_notes text,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.user_feedback enable row level security;

-- Users can insert their own feedback
create policy "users_insert_feedback" on public.user_feedback
  for insert with check (auth.uid() = user_id or user_id is null);

-- Admins/founders can see and update all feedback
create policy "admin_manage_feedback" on public.user_feedback
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

-- Site health reports from automated agents
create table if not exists public.site_health_reports (
  id          uuid primary key default gen_random_uuid(),
  agent_name  text not null,     -- e.g. 'Aria', 'Nova', 'Quinn'
  area        text not null,     -- e.g. 'girlmate', 'member_portal', 'performance'
  status      text not null,     -- 'healthy' | 'warning' | 'critical'
  summary     text not null,
  details     jsonb,
  action_taken text,
  needs_approval boolean not null default false,
  approval_status text,          -- null | 'pending' | 'approved' | 'rejected'
  created_at  timestamptz not null default now()
);

alter table public.site_health_reports enable row level security;

create policy "admin_manage_health_reports" on public.site_health_reports
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

-- Index for fast recent lookups
create index if not exists idx_feedback_status on public.user_feedback(status, created_at desc);
create index if not exists idx_health_created on public.site_health_reports(created_at desc);
