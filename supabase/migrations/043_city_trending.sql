-- ── City Trending: live "what's hot" feed for the City section ───────────────
-- Curators submit trending spots/moments. Admin approves.
-- Replaces the hardcoded TREND_LIST in city-page.tsx.

create table if not exists public.city_trending (
  id           uuid primary key default gen_random_uuid(),
  city         text not null default 'New York',  -- global-ready
  neighborhood text,
  name         text not null,                      -- "Dior Café Pop-Up on Madison"
  category     text not null
    check (category in ('dining','drinks','pop-up','art','nightlife','brunch','coffee','shopping','wellness','event','other')),
  description  text,                               -- 1-2 sentences
  source       text,                               -- "Eater NYC", "Time Out", "Vogue", "Bloomie tip", "Instagram"
  source_url   text,                               -- link to the article/post
  image_url    text,
  badge        text,                               -- "NEW", "MOST SAVED", "SELLING OUT", null
  status       text not null default 'pending'
    check (status in ('pending','approved','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by  uuid references public.profiles(id) on delete set null,
  approved_at  timestamptz,
  week_of      date not null default current_date, -- which week this is trending for
  rank_order   smallint default 99,                -- manual sort order within the week
  save_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists trending_city_week_idx on public.city_trending(city, week_of desc, status, rank_order);

alter table public.city_trending enable row level security;

-- Public can read approved items
create policy "trending_read_approved"
  on public.city_trending for select
  using (status = 'approved');

-- Curators and admins can submit
create policy "trending_submit"
  on public.city_trending for insert
  with check (
    auth.uid() = submitted_by and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('curator','admin','founder')
    )
  );

-- Admins/founders can approve and update
create policy "trending_manage"
  on public.city_trending for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder')
    )
  );

-- ── City Trending Saves: women save trending spots ────────────────────────────
create table if not exists public.city_trending_saves (
  trending_id uuid not null references public.city_trending(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  saved_at    timestamptz not null default now(),
  primary key (trending_id, user_id)
);

alter table public.city_trending_saves enable row level security;

create policy "trending_saves_read_own"
  on public.city_trending_saves for select
  using (auth.uid() = user_id);

create policy "trending_saves_add"
  on public.city_trending_saves for insert
  with check (auth.uid() = user_id);

create policy "trending_saves_remove"
  on public.city_trending_saves for delete
  using (auth.uid() = user_id);

-- Auto-increment save_count when a woman saves a trending spot
create or replace function public.inc_trending_saves()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.city_trending set save_count = save_count + 1 where id = NEW.trending_id;
  elsif TG_OP = 'DELETE' then
    update public.city_trending set save_count = greatest(0, save_count - 1) where id = OLD.trending_id;
  end if;
  return null;
end;
$$;

create trigger trending_saves_count
  after insert or delete on public.city_trending_saves
  for each row execute function public.inc_trending_saves();
