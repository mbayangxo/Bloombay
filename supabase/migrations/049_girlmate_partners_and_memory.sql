-- ── GirlMate Partner Applications ────────────────────────────────────────────
create table if not exists public.girlmate_partner_applications (
  id            uuid        primary key default gen_random_uuid(),
  contact_name  text        not null,
  email         text        not null,
  group_name    text        not null,
  platform      text        not null default 'other',
  group_size    text,
  cities        text,
  description   text,
  why_partner   text,
  status        text        not null default 'pending'
                            check (status in ('pending', 'approved', 'declined')),
  partner_code  text        unique,   -- generated on approval, used as invite link key
  submitted_at  timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   text
);

alter table public.girlmate_partner_applications enable row level security;
create policy "gm_partner_apps_service_only"
  on public.girlmate_partner_applications using (false);

-- ── Yande Memory Layer ────────────────────────────────────────────────────────
-- One note per member per month; powers personalisation and friendship health
create table if not exists public.yande_memories (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  month_of   text        not null,  -- "2026-06"
  note       text        not null,  -- Yande's memory note
  raw_data   jsonb,                 -- clubs, wall_posts, blooms counts
  created_at timestamptz not null default now(),
  unique (user_id, month_of)
);

alter table public.yande_memories enable row level security;

-- Members can read their own memories (for future in-app use)
create policy "memories_own_read"
  on public.yande_memories for select
  using (auth.uid() = user_id);

-- Service role writes (cron bypasses RLS automatically)

create index if not exists yande_memories_user_idx on public.yande_memories(user_id, month_of desc);
