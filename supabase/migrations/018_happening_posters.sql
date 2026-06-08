-- Happening poster fields on gatherings (event type, template variant, cover image)

alter table public.gatherings
  add column if not exists event_type text,
  add column if not exists poster_variant text,
  add column if not exists image_url text,
  add column if not exists description text,
  add column if not exists price_cents int not null default 0,
  add column if not exists host_name text;
