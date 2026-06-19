-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- USER PROFILES
-- ─────────────────────────────────────────────
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  age integer,
  gender text,
  residence_country text,
  citizenship_countries text[] default '{}',
  parent_citizenship_countries text[] default '{}',
  diaspora_status boolean default false,
  business_stage text check (business_stage in ('idea','registered','operating','scaling')),
  sectors text[] default '{}',
  target_countries text[] default '{}',
  funding_types text[] default '{}',
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- OPPORTUNITIES
-- ─────────────────────────────────────────────
create table if not exists public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  country text not null,
  region text,
  type text not null check (type in ('grant','loan','tender','contract','accelerator','fellowship','procurement','training','investment','fund')),
  sectors text[] default '{}',
  eligibility_age_min integer,
  eligibility_age_max integer,
  eligibility_gender text,
  eligibility_citizenship text[],
  eligibility_residence text[],
  diaspora_allowed boolean default true,
  business_stage_required text[],
  amount numeric,
  currency text default 'USD',
  deadline date,
  source_url text not null,
  source_name text not null,
  verified_status text default 'needs_review' check (verified_status in ('verified','needs_review','unverified')),
  summary text not null,
  documents_required text[],
  application_steps text[],
  notes text,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.opportunities enable row level security;

create policy "Anyone can read active opportunities"
  on public.opportunities for select
  using (archived = false);

create policy "Service role can manage opportunities"
  on public.opportunities for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- ─────────────────────────────────────────────
-- SAVED OPPORTUNITIES
-- ─────────────────────────────────────────────
create table if not exists public.saved_opportunities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  status text default 'saved' check (status in ('saved','applying','submitted','won','rejected')),
  created_at timestamptz default now(),
  unique(user_id, opportunity_id)
);

alter table public.saved_opportunities enable row level security;

create policy "Users can manage own saved opportunities"
  on public.saved_opportunities for all
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- COUNTRY PROFILES
-- ─────────────────────────────────────────────
create table if not exists public.country_profiles (
  id uuid primary key default uuid_generate_v4(),
  country text not null unique,
  country_code text not null,
  flag_emoji text not null,
  languages text[] default '{}',
  major_industries text[] default '{}',
  cultural_notes text,
  historical_notes text,
  procurement_links text[],
  youth_programs text,
  women_programs text,
  sme_agencies text,
  startup_notes text,
  diaspora_notes text,
  business_etiquette text,
  created_at timestamptz default now()
);

alter table public.country_profiles enable row level security;

create policy "Anyone can read country profiles"
  on public.country_profiles for select
  using (true);

create policy "Service role can manage country profiles"
  on public.country_profiles for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
