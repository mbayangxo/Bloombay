-- Add appreciation_type (petal | flower) to hanger_flowers

alter table public.hanger_flowers
  add column if not exists appreciation_type text not null default 'petal'
  check (appreciation_type in ('petal', 'flower'));

-- View: petal + flower counts per listing
create or replace view public.hanger_listing_appreciation as
select
  listing_id,
  count(*) filter (where appreciation_type = 'petal')  as petal_count,
  count(*) filter (where appreciation_type = 'flower') as flower_count
from public.hanger_flowers
where listing_id is not null
group by listing_id;
