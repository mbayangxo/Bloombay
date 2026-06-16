-- ── Avenue Weekly Content ─────────────────────────────────────────────────────
-- Each Avenue room has weekly content curated by its AI editor.
-- Human curator reviews and approves before it goes live.
-- Replaces all hardcoded mock arrays in the Avenue page components.

create table if not exists public.avenue_content (
  id           uuid primary key default gen_random_uuid(),

  -- Which room this content belongs to
  room         text not null
    check (room in ('magazine','book','screening','wellness','hanger','vanity','wall','shop','city')),

  -- Content shape varies by room — stored as flexible JSON
  content_type text not null,  -- 'article', 'book_rec', 'film_rec', 'wellness_tip', 'style_pick', 'beauty_tip', 'community_prompt', 'product_rec', 'place'

  -- Core fields (all rooms)
  title        text not null,
  body         text,            -- main content / description
  image_url    text,
  source       text,            -- "AI-generated", "Eater NYC", "TikTok", "Curator", etc.
  source_url   text,

  -- Structured extras as JSON (room-specific fields)
  -- Magazine: { section, dek, read_time, author }
  -- Book: { book_author, rating, why, isbn }
  -- Screening: { where_to_watch, genre, runtime }
  -- Wellness: { ingredients, steps, category }
  -- Hanger/Vanity: { price, brand, buy_url }
  -- City: { neighborhood, category, badge }
  meta         jsonb default '{}',

  -- Editorial
  yande_note   text,           -- AI-written one-liner
  badge        text,           -- "NEW", "TRENDING", "STAFF PICK", "THIS WEEK", null
  week_of      date not null default current_date,
  rank_order   smallint default 99,

  -- Workflow
  status       text not null default 'pending'
    check (status in ('pending','approved','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,  -- null = AI-generated
  approved_by  uuid references public.profiles(id) on delete set null,
  approved_at  timestamptz,

  -- Engagement
  save_count   integer not null default 0,
  like_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists avenue_content_room_week_idx on public.avenue_content(room, week_of desc, status, rank_order);
create index if not exists avenue_content_status_idx    on public.avenue_content(status, room, week_of desc);

alter table public.avenue_content enable row level security;

create policy "avenue_content_read_approved"
  on public.avenue_content for select
  using (status = 'approved');

create policy "avenue_content_submit"
  on public.avenue_content for insert
  with check (
    auth.uid() is not null and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('curator','admin','founder')
    )
  );

create policy "avenue_content_manage"
  on public.avenue_content for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder')
    )
  );

-- ── Avenue Content Saves ──────────────────────────────────────────────────────
create table if not exists public.avenue_content_saves (
  content_id uuid not null references public.avenue_content(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (content_id, user_id)
);

alter table public.avenue_content_saves enable row level security;

create policy "avenue_saves_own"
  on public.avenue_content_saves for select using (auth.uid() = user_id);
create policy "avenue_saves_add"
  on public.avenue_content_saves for insert with check (auth.uid() = user_id);
create policy "avenue_saves_remove"
  on public.avenue_content_saves for delete using (auth.uid() = user_id);

-- Auto-increment save_count
create or replace function public.inc_avenue_saves()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.avenue_content set save_count = save_count + 1 where id = NEW.content_id;
  elsif TG_OP = 'DELETE' then
    update public.avenue_content set save_count = greatest(0, save_count - 1) where id = OLD.content_id;
  end if;
  return null;
end;
$$;

create trigger avenue_saves_count
  after insert or delete on public.avenue_content_saves
  for each row execute function public.inc_avenue_saves();
