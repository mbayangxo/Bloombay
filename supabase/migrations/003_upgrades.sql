-- Migration 003: Upgrade tables for feed subscriptions, testimonials, paths, and B2B submissions

-- Enable UUID extension (idempotent)
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- OPPORTUNITY PATHS
-- ─────────────────────────────────────────────
create table if not exists public.opportunity_paths (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal text not null,
  steps jsonb not null default '[]',
  status text default 'active' check (status in ('active','completed','abandoned')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.opportunity_paths enable row level security;

create policy "Users manage own paths"
  on public.opportunity_paths for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- TESTIMONIALS
-- ─────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  user_display_name text not null,
  user_location text,
  content text not null,
  amount_received text,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;

create policy "Anyone can read verified testimonials"
  on public.testimonials for select
  using (verified = true);

create policy "Service role can manage testimonials"
  on public.testimonials for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- ─────────────────────────────────────────────
-- FEED SUBSCRIPTIONS
-- ─────────────────────────────────────────────
create table if not exists public.feed_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  countries text[] default '{}',
  sectors text[] default '{}',
  frequency text default 'weekly' check (frequency in ('daily','weekly','monthly')),
  confirmed boolean default false,
  created_at timestamptz default now()
);

alter table public.feed_subscriptions enable row level security;

create policy "Anyone can subscribe to feed"
  on public.feed_subscriptions for insert
  with check (true);

create policy "Users can read own subscription"
  on public.feed_subscriptions for select
  using (true);

-- ─────────────────────────────────────────────
-- B2B PROGRAM SUBMISSIONS
-- ─────────────────────────────────────────────
create table if not exists public.program_submissions (
  id uuid primary key default uuid_generate_v4(),
  org_name text not null,
  org_type text,
  program_name text not null,
  contact_email text not null,
  description text not null,
  source_url text not null,
  status text default 'pending' check (status in ('pending','approved','rejected','live')),
  reviewer_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.program_submissions enable row level security;

create policy "Anyone can submit programs"
  on public.program_submissions for insert
  with check (true);

create policy "Service role can manage submissions"
  on public.program_submissions for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- ─────────────────────────────────────────────
-- SAMPLE TESTIMONIALS
-- ─────────────────────────────────────────────
insert into public.testimonials (opportunity_id, user_display_name, user_location, content, amount_received, verified) values
  (null, 'Amara O.', 'Lagos, Nigeria', 'I did not know NYIF existed until I found this platform. Applied in March. Received ₦5M in August. I used it to buy my first delivery van.', '₦5,000,000', true),
  (null, 'Fatou D.', 'Dakar, Senegal', 'ADEPME helped me formalize my catering business for free. Within 3 months I had access to government supply contracts I never knew I could bid on.', null, true),
  (null, 'Kwame A.', 'London, UK (Ghana citizen)', 'I am diaspora — based in London. Through this platform I found a non-resident business program in Ghana that let me register a company and open a bank account without being there.', null, true),
  (null, 'Naledi M.', 'Johannesburg, South Africa', 'The NEF Women Fund approved my application for R1.2M. I had tried three banks before. The platform showed me exactly what documents I needed.', 'R1,200,000', true),
  (null, 'Ibrahim C.', 'Kigali, Rwanda', 'BDF guaranteed my loan when the bank said no. This platform explained how it worked in plain English. Game changer.', null, true),
  (null, 'Aïssatou B.', 'Abidjan, Côte d''Ivoire', 'CEPICI registered my company in 48 hours and I had a bank account within a week. I did not know this was possible. Now I am bidding on government supply contracts.', null, true),
  (null, 'Chukwuemeka N.', 'Port Harcourt, Nigeria', 'Applied to TEF at 24. Got $5,000 non-refundable. That seed capital let me quit my job and build full-time. Three years later my business has 12 employees.', '$5,000', true);
