-- Careers applications (public apply → founder portal review)

create table if not exists public.careers_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (
    status in ('new', 'reviewed', 'contacted', 'approved', 'rejected')
  ),
  first_name text not null,
  email text not null,
  phone text,
  role_title text not null,
  role_category text not null default 'other' check (
    role_category in ('curator', 'operations', 'engineering', 'marketing', 'other')
  ),
  city text,
  resume_url text,
  linkedin_url text,
  portfolio_url text,
  cover_letter text
);

create index if not exists careers_applications_created_at_idx
  on public.careers_applications (created_at desc);
create index if not exists careers_applications_status_idx
  on public.careers_applications (status);

alter table public.careers_applications enable row level security;

-- Inserts go through API (service role). No public read.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.careers_applications to service_role;
