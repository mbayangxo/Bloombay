-- Club page layout template (editorial | salon | midnight)

alter table public.clubs
  add column if not exists layout_key text default 'salon';
