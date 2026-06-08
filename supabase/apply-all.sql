-- BloomBay: run this entire file in Supabase Dashboard → SQL Editor → Run
-- Project: https://kkyoxheenixtlumghffy.supabase.co

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

grant usage on schema public to anon, authenticated, service_role;
grant insert on public.waitlist to anon, authenticated;
grant select, update, delete on public.waitlist to service_role;

-- Profiles + roles (full file: supabase/migrations/002_profiles_auth.sql)

create type public.user_role as enum (
  'member', 'founder', 'admin', 'club_owner', 'partner', 'moderator', 'curator'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role public.user_role not null default 'member',
  city text,
  neighborhood text,
  verified boolean not null default false,
  host_level text default null,
  trust_score int default 0,
  attendance_score int default 0,
  community_score int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
alter table public.profiles enable row level security;

drop policy if exists "Profiles read own" on public.profiles;
create policy "Profiles read own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Profiles update own" on public.profiles;
create policy "Profiles update own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, city, neighborhood, role)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(
      nullif(trim(new.phone), ''),
      nullif(trim(new.raw_user_meta_data->>'phone'), '')
    ),
    nullif(trim(new.raw_user_meta_data->>'city'), ''),
    nullif(trim(new.raw_user_meta_data->>'neighborhood'), ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role)
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, profiles.email),
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone),
    city = coalesce(nullif(excluded.city, ''), profiles.city),
    neighborhood = coalesce(nullif(excluded.neighborhood, ''), profiles.neighborhood),
    updated_at = now();
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
