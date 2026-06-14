-- Waitlist table for BloomBay pre-launch lead capture
create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  first_name   text,
  phone_number text,
  city         text,
  goals        text[] default '{}',
  status       text not null default 'waiting',  -- waiting | invited | joined
  invited_at   timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Only service role can read/write (admin operations)
-- Users cannot directly read the waitlist
create policy "service_role_all" on public.waitlist
  for all using (false) with check (false);
