-- Bloom Notes: photos + happenings (gatherings) support
-- Product name: Bloom Notes — real member notes (with optional photos) on places & happenings

alter table public.bloom_notes
  add column if not exists photo_urls text[] not null default '{}';

alter table public.bloom_notes
  add column if not exists gathering_id uuid references public.gatherings(id) on delete cascade;

create index if not exists bloom_notes_gathering_idx
  on public.bloom_notes (gathering_id, created_at desc)
  where gathering_id is not null;

-- Keep restaurant_partners.bloom_notes count in sync when notes use the partner slug
create or replace function public.sync_partner_bloom_note_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_slug text;
begin
  v_slug := coalesce(NEW.place_slug, OLD.place_slug);
  if v_slug is null then
    return null;
  end if;

  update public.restaurant_partners
  set bloom_notes = (
    select count(*)::int from public.bloom_notes where place_slug = v_slug
  )
  where slug = v_slug;

  return null;
end;
$$;

drop trigger if exists bloom_notes_partner_count on public.bloom_notes;
create trigger bloom_notes_partner_count
  after insert or delete on public.bloom_notes
  for each row execute function public.sync_partner_bloom_note_count();

comment on column public.bloom_notes.photo_urls is
  'Optional member photos attached to a Bloom Note (places, venues, happenings)';
comment on column public.bloom_notes.gathering_id is
  'When set, this Bloom Note belongs to a Happening gathering';
