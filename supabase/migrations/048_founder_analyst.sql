-- Founder Analyst: weekly Yande digest reports
create table if not exists public.founder_analyst_reports (
  id          uuid        primary key default gen_random_uuid(),
  week_of     date        not null unique,
  report_text text        not null,
  raw_data    jsonb,
  created_at  timestamptz not null default now()
);

-- Only service role (cron) can write; founder reads via admin dashboard
alter table public.founder_analyst_reports enable row level security;
create policy "analyst_reports_service_only"
  on public.founder_analyst_reports using (false);
