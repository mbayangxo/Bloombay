-- Add swap support to hanger_listings
-- listing_type: sell | swap | sell_or_swap
-- swap_wants: free text describing what the lister wants in return

alter table public.hanger_listings
  add column if not exists listing_type text not null default 'sell'
    check (listing_type in ('sell', 'swap', 'sell_or_swap')),
  add column if not exists swap_wants text;

-- price_cents is 0 for pure swap listings
comment on column public.hanger_listings.price_cents is
  'Price in cents. 0 for swap-only listings.';

create index if not exists hanger_listings_type_idx
  on public.hanger_listings(listing_type, status, created_at desc);
