-- Run in Supabase SQL editor for founder dashboard status workflow
alter table public.waitlist
  add column if not exists status text not null default 'new';

alter table public.waitlist
  drop constraint if exists waitlist_status_check;

alter table public.waitlist
  add constraint waitlist_status_check
  check (status in ('new', 'reviewed', 'contacted', 'approved', 'rejected'));

create index if not exists waitlist_status_idx on public.waitlist (status);
create index if not exists waitlist_signup_type_idx on public.waitlist (signup_type);
create index if not exists waitlist_city_idx on public.waitlist (city);
