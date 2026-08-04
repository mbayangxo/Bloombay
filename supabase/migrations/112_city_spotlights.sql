-- Weekly themed recommendation spotlights for Eat/Go/Solo ("Best Croissants
-- This Week", "Best Matcha This Month") — curated from REAL approved
-- city_trending / restaurant_partners rows only. The cron that populates
-- this never invents places; it only groups existing real entries by theme,
-- and skips a theme entirely if there isn't enough real data to support it.
create table if not exists public.city_spotlights (
  id           uuid primary key default gen_random_uuid(),
  page         text not null check (page in ('eat', 'go', 'solo')),
  theme        text not null,
  blurb        text,
  trending_ids uuid[] not null default '{}',
  partner_ids  uuid[] not null default '{}',
  week_of      date not null default current_date,
  created_at   timestamptz not null default now(),
  unique (page, theme, week_of)
);

create index if not exists city_spotlights_page_week_idx
  on public.city_spotlights(page, week_of desc);

alter table public.city_spotlights enable row level security;

create policy "city_spotlights_read_all"
  on public.city_spotlights for select using (true);

-- No client insert/update policy — only the cron (service role) writes here.
