-- Hanger profile features: reviews, flowers (appreciation), listing comments, draft status

-- 1. Allow draft status on listings (already has 'active', 'sold', adding 'draft')
alter table public.hanger_listings
  drop constraint if exists hanger_listings_status_check;

alter table public.hanger_listings
  add constraint hanger_listings_status_check
  check (status in ('draft', 'active', 'sold', 'given', 'swapped'));

-- 2. Hanger reviews — given to a seller after a transaction (or by community)
create table if not exists public.hanger_reviews (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references auth.users(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid references public.hanger_listings(id) on delete set null,
  rating      smallint not null check (rating between 1 and 5),
  body        text,
  created_at  timestamptz not null default now(),
  unique (reviewer_id, listing_id)
);
alter table public.hanger_reviews enable row level security;
create policy "read hanger reviews" on public.hanger_reviews for select using (true);
create policy "insert own hanger review" on public.hanger_reviews
  for insert with check (auth.uid() = reviewer_id);
create index if not exists hanger_reviews_seller_idx on public.hanger_reviews(seller_id, created_at desc);

-- 3. Hanger flowers — send an appreciation flower to a seller/listing
create table if not exists public.hanger_flowers (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid references public.hanger_listings(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (sender_id, listing_id)
);
alter table public.hanger_flowers enable row level security;
create policy "read hanger flowers" on public.hanger_flowers for select using (true);
create policy "insert hanger flower" on public.hanger_flowers
  for insert with check (auth.uid() = sender_id and auth.uid() != recipient_id);
create policy "delete own hanger flower" on public.hanger_flowers
  for delete using (auth.uid() = sender_id);
create index if not exists hanger_flowers_recipient_idx on public.hanger_flowers(recipient_id);
create index if not exists hanger_flowers_listing_idx   on public.hanger_flowers(listing_id);

-- 4. Hanger listing comments
create table if not exists public.hanger_comments (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.hanger_listings(id) on delete cascade,
  author_id   uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);
alter table public.hanger_comments enable row level security;
create policy "read hanger comments" on public.hanger_comments for select using (true);
create policy "insert own hanger comment" on public.hanger_comments
  for insert with check (auth.uid() = author_id);
create policy "delete own hanger comment" on public.hanger_comments
  for delete using (auth.uid() = author_id);
create index if not exists hanger_comments_listing_idx on public.hanger_comments(listing_id, created_at desc);

-- 5. View: hanger seller stats (flower count, review avg, review count)
create or replace view public.hanger_seller_stats as
select
  u.id as seller_id,
  coalesce(r.review_count, 0) as review_count,
  coalesce(r.avg_rating, 0)   as avg_rating,
  coalesce(f.flower_count, 0) as flower_count
from auth.users u
left join (
  select seller_id, count(*) as review_count, round(avg(rating)::numeric, 1) as avg_rating
  from public.hanger_reviews
  group by seller_id
) r on r.seller_id = u.id
left join (
  select recipient_id, count(*) as flower_count
  from public.hanger_flowers
  group by recipient_id
) f on f.recipient_id = u.id;
