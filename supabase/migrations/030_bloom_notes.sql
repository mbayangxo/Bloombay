-- Bloom notes: little notes women leave behind at places — separate from reviews.
-- Other women can give the author flowers (likes) and save the note.

create table if not exists public.bloom_notes (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  place_slug  text not null,            -- restaurant partner slug or city place id
  place_name  text,                     -- denormalized for display ("Carbone")
  content     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.bloom_note_flowers (
  note_id     uuid not null references public.bloom_notes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (note_id, user_id)
);

create table if not exists public.bloom_note_saves (
  note_id     uuid not null references public.bloom_notes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (note_id, user_id)
);

-- RLS
alter table public.bloom_notes        enable row level security;
alter table public.bloom_note_flowers enable row level security;
alter table public.bloom_note_saves   enable row level security;

create policy "notes_read_all"
  on public.bloom_notes for select using (true);

create policy "notes_insert_own"
  on public.bloom_notes for insert with check (auth.uid() = author_id);

create policy "notes_delete_own"
  on public.bloom_notes for delete using (auth.uid() = author_id);

create policy "flowers_read_all"
  on public.bloom_note_flowers for select using (true);

create policy "flowers_give_own"
  on public.bloom_note_flowers for insert with check (auth.uid() = user_id);

create policy "flowers_take_back_own"
  on public.bloom_note_flowers for delete using (auth.uid() = user_id);

create policy "saves_read_own"
  on public.bloom_note_saves for select using (auth.uid() = user_id);

create policy "saves_insert_own"
  on public.bloom_note_saves for insert with check (auth.uid() = user_id);

create policy "saves_delete_own"
  on public.bloom_note_saves for delete using (auth.uid() = user_id);

-- When a woman gives a flower, the note's author hears about it
create or replace function public.notify_bloom_note_flower()
returns trigger language plpgsql security definer as $$
declare
  v_author uuid;
  v_place  text;
begin
  select author_id, coalesce(place_name, place_slug)
    into v_author, v_place
    from public.bloom_notes where id = new.note_id;

  if v_author is not null and v_author <> new.user_id then
    perform public.create_notification(
      v_author,
      'flower',
      'Someone gave your bloom note a flower',
      'Your note at ' || v_place || ' meant something to her.',
      '/member/city',
      jsonb_build_object('note_id', new.note_id, 'place_slug', (select place_slug from public.bloom_notes where id = new.note_id))
    );
  end if;
  return new;
end;
$$;

create trigger bloom_note_flower_notify
  after insert on public.bloom_note_flowers
  for each row execute function public.notify_bloom_note_flower();

-- Indexes
create index if not exists bloom_notes_place_idx  on public.bloom_notes(place_slug, created_at desc);
create index if not exists bloom_notes_author_idx on public.bloom_notes(author_id, created_at desc);
create index if not exists note_saves_user_idx    on public.bloom_note_saves(user_id, created_at desc);
