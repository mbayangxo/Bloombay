-- Club studio: crest, aesthetic, default happening template

alter table public.clubs
  add column if not exists crest_symbol text,
  add column if not exists crest_accent text,
  add column if not exists aesthetic_key text,
  add column if not exists category text,
  add column if not exists default_happening_template text,
  add column if not exists membership_type text default 'curated';
