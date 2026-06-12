-- Restaurant partners for City > Eat section
create table if not exists restaurant_partners (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  owner_id      uuid references auth.users(id) on delete set null,

  -- Core identity
  name          text not null,
  restaurant_type text not null default 'casual', -- fine_dining | café | bar | bakery | casual
  neighborhood  text,
  city          text not null default 'New York',
  tagline       text,
  about         text,

  -- Bloom editorial
  bloom_notes   integer not null default 0,      -- "123 bloom notes"
  bloom_rating  numeric(2,1) not null default 4.5,
  loved_by      text[],                          -- ["locals", "night owls", ...]
  poem          text,                            -- short lyric shown in hero
  polaroid_caption text,
  host_note     text,
  bloom_tips    text[],                          -- pink sticky note bullets
  girl_favorites jsonb,                          -- [{name, description}]
  reviews       jsonb,                           -- [{author, text, rating}]

  -- Practical info
  hours         jsonb,                           -- {mon:"closed", tue:"6pm–2am", ...}
  instagram     text,
  address       text,
  price_range   text,                            -- $, $$, $$$, $$$$

  -- Media
  cover_url     text,
  photo_urls    text[] default '{}',
  menu_url      text,

  -- Brand
  brand_color   text default '#FF1F7D',

  -- Bloom passport
  visited_by    uuid[] default '{}',             -- user ids who visited

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table restaurant_partners enable row level security;

create policy "Anyone can view partners"
  on restaurant_partners for select using (true);

create policy "Owner can update partner"
  on restaurant_partners for update
  using (auth.uid() = owner_id);

create policy "Owner can insert partner"
  on restaurant_partners for insert
  with check (auth.uid() = owner_id);

-- Trigger: updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger restaurant_partners_updated_at
  before update on restaurant_partners
  for each row execute procedure set_updated_at();
