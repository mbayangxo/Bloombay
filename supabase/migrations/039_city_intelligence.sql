-- Women's City Intelligence: structured insight tags on bloom notes.
-- New-in-Town layer: arrival status on profiles.

-- Structured insight tags for bloom notes
create table if not exists public.bloom_note_tags (
  note_id  uuid not null references public.bloom_notes(id) on delete cascade,
  tag      text not null check (tag in (
    'solo_friendly',
    'group_vibes',
    'laptop_friendly',
    'first_date',
    'meet_people',
    'worth_it',
    'romantic',
    'special_occasion'
  )),
  primary key (note_id, tag)
);

alter table public.bloom_note_tags enable row level security;

create policy "note_tags_read_all"
  on public.bloom_note_tags for select using (true);

create policy "note_tags_insert_own"
  on public.bloom_note_tags for insert
  with check (
    auth.uid() = (select author_id from public.bloom_notes where id = note_id)
  );

create policy "note_tags_delete_own"
  on public.bloom_note_tags for delete
  using (
    auth.uid() = (select author_id from public.bloom_notes where id = note_id)
  );

-- New-in-Town layer on profiles
alter table public.profiles
  add column if not exists arrival_status text
    check (arrival_status in ('just_moved','new_6mo','fresh_start','local','native'));

-- Indexes
create index if not exists bloom_note_tags_note_idx on public.bloom_note_tags(note_id);
create index if not exists bloom_note_tags_tag_idx  on public.bloom_note_tags(tag);
create index if not exists profiles_arrival_idx     on public.profiles(arrival_status) where arrival_status is not null;
