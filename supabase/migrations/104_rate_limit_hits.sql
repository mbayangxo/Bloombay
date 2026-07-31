-- 104_rate_limit_hits.sql
-- Lightweight, dependency-free rate limiting for unauthenticated write
-- endpoints (waitlist, feedback, job applications, girlmate partner
-- applications) — no Redis/Upstash infra exists in this project, and
-- adding one is a bigger infra decision than this migration should make.
-- Postgres is already a hard dependency, so a simple hits table is the
-- lowest-risk way to close the "no rate limiting anywhere" gap for now.

create table if not exists public.rate_limit_hits (
  id         uuid primary key default gen_random_uuid(),
  rl_key     text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_key_idx on public.rate_limit_hits (rl_key, created_at desc);

-- Only ever read/written via the service-role client (lib/rate-limit.ts) —
-- RLS enabled with no policies means anon/authenticated are fully denied,
-- service role bypasses as usual.
alter table public.rate_limit_hits enable row level security;

-- Old rows are worthless after their window passes; keep the table small.
create or replace function public.prune_rate_limit_hits() returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rate_limit_hits where created_at < now() - interval '1 day';
$$;
