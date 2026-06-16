-- Purchase/transaction ledger for BloomBay
-- Records every completed payment across all types
create table if not exists public.purchases (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete set null,
  type                text not null,            -- membership | ticket | club_membership | hanger_purchase
  stripe_session_id   text,
  stripe_payment_intent text,
  amount_cents        integer,
  currency            text not null default 'gbp',
  item_name           text,                      -- human-readable item/event/club name
  item_id             text,                      -- event_id | club_id | listing_id | null
  status              text not null default 'completed',
  created_at          timestamptz not null default now()
);

create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_created_at_idx on public.purchases(created_at desc);

alter table public.purchases enable row level security;

-- Users can only read their own purchases
create policy "users_read_own_purchases" on public.purchases
  for select using (auth.uid() = user_id);

-- Service role inserts (via webhook)
create policy "service_insert_purchases" on public.purchases
  for insert with check (true);

-- Hanger seller earnings view
-- Shows the seller side: for each hanger_purchase, seller receives 90% of sale price
create or replace view public.hanger_earnings as
  select
    p.id,
    p.user_id as buyer_id,
    hl.seller_id,
    p.item_name,
    p.item_id as listing_id,
    p.amount_cents,
    round(p.amount_cents * 0.90)::integer as seller_receives_cents,
    round(p.amount_cents * 0.10)::integer as bloombay_fee_cents,
    p.created_at
  from public.purchases p
  join public.hanger_listings hl on hl.id = p.item_id::uuid
  where p.type = 'hanger_purchase'
    and p.status = 'completed';
