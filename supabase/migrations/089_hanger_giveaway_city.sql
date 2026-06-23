-- Add give_away listing type and city field to hanger_listings

-- Drop the old check constraint and add give_away
alter table public.hanger_listings
  drop constraint if exists hanger_listings_listing_type_check;

alter table public.hanger_listings
  add constraint hanger_listings_listing_type_check
  check (listing_type in ('sell', 'swap', 'sell_or_swap', 'give_away'));

-- Add city column (where the item is located — required for pickup/local context)
alter table public.hanger_listings
  add column if not exists city text;

create index if not exists hanger_listings_city_idx on public.hanger_listings(city, status, created_at desc);
