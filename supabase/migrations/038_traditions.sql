-- Traditions: recurring event series that can graduate to clubs.
-- Gathering → Tradition → Club is the BloomBay growth pipeline.

-- Add host_id to gatherings so we can do reputation queries
alter table public.gatherings
  add column if not exists host_id uuid references public.profiles(id) on delete set null;

-- Add tradition_id to gatherings to link them to a series
alter table public.gatherings
  add column if not exists tradition_id uuid;

-- Traditions table
create table if not exists public.traditions (
  id            uuid primary key default gen_random_uuid(),
  host_id       uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  slug          text not null unique,
  description   text,
  frequency     text not null default 'monthly'
    check (frequency in ('weekly','biweekly','monthly','seasonal','irregular')),
  neighborhood  text,
  cover_url     text,
  primary_color text default '#FF1F7D',
  status        text not null default 'active'
    check (status in ('active','paused','became_club')),
  club_id       uuid references public.clubs(id) on delete set null,
  gathering_count int not null default 0,
  follower_count  int not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.tradition_followers (
  tradition_id  uuid not null references public.traditions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (tradition_id, user_id)
);

-- RLS
alter table public.traditions       enable row level security;
alter table public.tradition_followers enable row level security;

create policy "traditions_read_all"
  on public.traditions for select using (true);

create policy "traditions_insert_own"
  on public.traditions for insert with check (auth.uid() = host_id);

create policy "traditions_update_own"
  on public.traditions for update using (auth.uid() = host_id);

create policy "tradition_followers_read_all"
  on public.tradition_followers for select using (true);

create policy "tradition_followers_insert_own"
  on public.tradition_followers for insert with check (auth.uid() = user_id);

create policy "tradition_followers_delete_own"
  on public.tradition_followers for delete using (auth.uid() = user_id);

-- Keep follower_count in sync
create or replace function public.sync_tradition_follower_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.traditions set follower_count = follower_count + 1 where id = new.tradition_id;
  elsif TG_OP = 'DELETE' then
    update public.traditions set follower_count = greatest(0, follower_count - 1) where id = old.tradition_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger tradition_follower_count_sync
  after insert or delete on public.tradition_followers
  for each row execute function public.sync_tradition_follower_count();

-- Indexes
create index if not exists traditions_host_idx       on public.traditions(host_id);
create index if not exists traditions_slug_idx       on public.traditions(slug);
create index if not exists tradition_followers_user  on public.tradition_followers(user_id);
create index if not exists gatherings_host_idx       on public.gatherings(host_id);
create index if not exists gatherings_tradition_idx  on public.gatherings(tradition_id);
