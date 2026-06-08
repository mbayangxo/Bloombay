-- BloomBay waitlist (run once in Supabase SQL Editor, or via scripts/db-setup.mjs)

create extension if not exists "pgcrypto";

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  signup_type text not null check (signup_type in ('member', 'club_host', 'partner')),
  status text not null default 'new' check (
    status in ('new', 'reviewed', 'contacted', 'approved', 'rejected')
  ),
  first_name text,
  email text,
  phone text,
  neighborhood text,
  city text,
  state text,
  country text,
  age_range text,
  reasons jsonb default '[]'::jsonb,
  interests jsonb default '[]'::jsonb,
  founding_mother boolean default false,
  extra_notes text,
  club_name text,
  club_platform text,
  club_member_count text,
  club_women_only boolean,
  business_name text,
  business_type text,
  business_socials text,
  offering text
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_status_idx on public.waitlist (status);
create index if not exists waitlist_signup_type_idx on public.waitlist (signup_type);
create index if not exists waitlist_city_idx on public.waitlist (city);

alter table public.waitlist enable row level security;

drop policy if exists "waitlist_public_insert" on public.waitlist;
create policy "waitlist_public_insert"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- SELECT/UPDATE: service role only (founder dashboard server routes).
-- The service role bypasses RLS; anon cannot read rows.

grant usage on schema public to anon, authenticated, service_role;
grant insert on public.waitlist to anon, authenticated;
grant select, update, delete on public.waitlist to service_role;
