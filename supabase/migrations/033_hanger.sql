create table if not exists public.hanger_listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  price_cents integer not null,
  size        text,
  category    text,
  condition   text default 'good',
  image_url   text,
  status      text not null default 'active',
  created_at  timestamptz not null default now()
);

create table if not exists public.hanger_sales (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.hanger_listings(id),
  seller_id   uuid not null references public.profiles(id),
  buyer_id    uuid not null references public.profiles(id),
  amount_cents integer not null,
  fee_cents    integer not null,
  payout_cents integer not null,
  paid_out    boolean default false,
  created_at  timestamptz not null default now()
);

-- Seller balance view
create or replace view public.hanger_seller_balance as
  select seller_id, coalesce(sum(payout_cents) filter (where not paid_out), 0) as pending_cents,
         coalesce(sum(payout_cents) filter (where paid_out), 0) as paid_out_cents
  from public.hanger_sales
  group by seller_id;

alter table public.hanger_listings enable row level security;
alter table public.hanger_sales    enable row level security;

create policy "listings_read_active" on public.hanger_listings for select using (status = 'active' or auth.uid() = seller_id);
create policy "listings_write_own"   on public.hanger_listings for insert with check (auth.uid() = seller_id);
create policy "listings_update_own"  on public.hanger_listings for update using  (auth.uid() = seller_id);
create policy "sales_read_own"       on public.hanger_sales    for select using  (auth.uid() = seller_id or auth.uid() = buyer_id);
create policy "sales_insert_any"     on public.hanger_sales    for insert with check (auth.uid() = buyer_id);

create index if not exists hanger_seller_idx   on public.hanger_listings(seller_id);
create index if not exists hanger_category_idx on public.hanger_listings(category, status);
create index if not exists hanger_created_idx  on public.hanger_listings(created_at desc);
