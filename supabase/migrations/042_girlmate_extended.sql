-- ── GirlMate: extend profiles to support rich listing types ──────────────────
-- The original girlmate_profiles table only had basic roommate fields.
-- This adds everything the UI needs: listing type, city, price, furnished, etc.

alter table public.girlmate_profiles
  add column if not exists display_name      text,
  add column if not exists listing_type      text not null default 'roommate-wanted'
    check (listing_type in ('room','apartment','roommate-wanted','co-search')),
  add column if not exists city              text not null default 'New York',
  add column if not exists neighborhood_name text,          -- human label e.g. "Williamsburg"
  add column if not exists price_cents       integer,       -- monthly rent/budget in cents
  add column if not exists available_from    date,
  add column if not exists available_to      date,          -- null = open-ended
  add column if not exists furnished         boolean default false,
  add column if not exists private_bathroom  boolean default false,
  add column if not exists weed_ok           boolean default false,
  add column if not exists halal_kitchen     boolean default false,
  add column if not exists wfh_friendly      boolean default false,
  add column if not exists partner_ok        boolean default false,
  add column if not exists show_profile      boolean default true,  -- link to BB profile
  add column if not exists description       text,
  add column if not exists yande_note        text,          -- AI-generated match note
  add column if not exists image_url         text;

-- Index for city-level queries (global listings)
create index if not exists girlmate_city_idx  on public.girlmate_profiles(city, is_active);
create index if not exists girlmate_type_idx  on public.girlmate_profiles(listing_type, is_active);
