-- Club logo templates + uploaded crest image

alter table public.clubs
  add column if not exists crest_image_url text,
  add column if not exists logo_template text,
  add column if not exists logo_text text;
