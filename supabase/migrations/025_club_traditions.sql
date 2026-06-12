-- ── CLUB TRADITIONS ──────────────────────────────────────────────
-- Step 1 of the "make women love their clubs" framework.
-- A tradition is a recurring ritual that defines club identity.

create table if not exists public.club_traditions (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid not null references public.clubs(id) on delete cascade,
  name        text not null,
  description text,
  frequency   text not null,  -- e.g. "Every third Friday", "Monthly", "Every December"
  emoji       text not null default '✨',
  since_year  integer,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.club_traditions enable row level security;

-- Anyone can read traditions
create policy "traditions_read_all"
  on public.club_traditions for select
  using (true);

-- Only the club owner can create/update/delete traditions
create policy "traditions_write_owner"
  on public.club_traditions for all
  using (
    exists (
      select 1 from public.clubs
      where id = club_id and owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clubs
      where id = club_id and owner_id = auth.uid()
    )
  );

-- Seed Museum Girls with example traditions
insert into public.club_traditions (club_id, name, description, frequency, emoji, since_year, sort_order)
select
  c.id,
  tradition.name,
  tradition.description,
  tradition.frequency,
  tradition.emoji,
  tradition.since_year,
  tradition.sort_order
from public.clubs c
cross join (
  values
    ('The Long Friday Dinner',    'Three courses, no phones, all conversation.',    'Every third Friday',    '🕯️', 2022, 1),
    ('Sunday Morning Walk',       'Coffee, city air, and good company.',            'Every Sunday · 9 AM',   '🌸', 2023, 2),
    ('The Annual Evening',        'Our biggest night of the year — always special.','Every December',        '✨', 2022, 3),
    ('First Wednesday Welcome',   'New members celebrated over cake.',              'First Wednesday / month','🎀', 2023, 4)
) as tradition(name, description, frequency, emoji, since_year, sort_order)
where c.name = 'Museum Girls'
on conflict do nothing;
