-- ── 1. Founding mother flag on profiles ──────────────────────────────────────
alter table public.profiles
  add column if not exists is_founding_mother boolean not null default false,
  add column if not exists founding_number    smallint;  -- their spot (1–100)

-- ── 2. Early access window on gatherings ─────────────────────────────────────
-- Founding mothers see the event starting at early_access_at; everyone else at starts_at
alter table public.gatherings
  add column if not exists early_access_at timestamptz;

-- ── 3. Founding mothers private chat ─────────────────────────────────────────
create table if not exists public.founding_chat_messages (
  id         uuid primary key default gen_random_uuid(),
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists founding_chat_created_idx
  on public.founding_chat_messages(created_at desc);

alter table public.founding_chat_messages enable row level security;

drop policy if exists "founding_chat_read" on public.founding_chat_messages;
create policy "founding_chat_read"
  on public.founding_chat_messages for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_founding_mother = true)
  );

drop policy if exists "founding_chat_send" on public.founding_chat_messages;
create policy "founding_chat_send"
  on public.founding_chat_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (select 1 from public.profiles where id = auth.uid() and is_founding_mother = true)
  );

-- ── 4. Weekly prompts ─────────────────────────────────────────────────────────
create table if not exists public.weekly_prompts (
  id            uuid primary key default gen_random_uuid(),
  category      text not null
    check (category in ('fashion','travel','career','wellness','friendships','city')),
  prompt_text   text not null,
  week_number   smallint not null check (week_number between 1 and 52),
  scheduled_for date,
  created_at    timestamptz not null default now(),
  unique (category, week_number)
);

create index if not exists prompts_category_week_idx
  on public.weekly_prompts(category, week_number);
create index if not exists prompts_scheduled_idx
  on public.weekly_prompts(scheduled_for);

alter table public.weekly_prompts enable row level security;

drop policy if exists "prompts_read_all" on public.weekly_prompts;
create policy "prompts_read_all"
  on public.weekly_prompts for select using (true);

drop policy if exists "prompts_write_admin" on public.weekly_prompts;
create policy "prompts_write_admin"
  on public.weekly_prompts for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );

-- ── 5. Club mama applications ─────────────────────────────────────────────────
create table if not exists public.club_mama_applications (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete set null,
  club_name        text not null,
  club_emoji       text,
  category         text,
  tagline          text,
  neighborhood     text,
  description      text,
  frequency        text,
  capacity         int,
  membership_type  text,
  why_run          text,
  experience       text,
  vision           text,
  status           text not null default 'pending'
    check (status in ('pending','approved','declined')),
  submitted_at     timestamptz not null default now(),
  reviewed_at      timestamptz,
  reviewed_by      uuid references public.profiles(id) on delete set null
);

create index if not exists mama_apps_status_idx
  on public.club_mama_applications(status, submitted_at desc);
create index if not exists mama_apps_user_idx
  on public.club_mama_applications(user_id);

alter table public.club_mama_applications enable row level security;

drop policy if exists "mama_apps_own_read" on public.club_mama_applications;
create policy "mama_apps_own_read"
  on public.club_mama_applications for select
  using (auth.uid() = user_id);

drop policy if exists "mama_apps_submit" on public.club_mama_applications;
create policy "mama_apps_submit"
  on public.club_mama_applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "mama_apps_admin" on public.club_mama_applications;
create policy "mama_apps_admin"
  on public.club_mama_applications for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );

-- ── 6. Notification type expansion ───────────────────────────────────────────
-- Drop and recreate the type check to include new types
alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in (
    'flower','seat','event','message','club','club_accepted',
    'intro','celebrate','club_new_post','gathering',
    'weekly_prompt','founding_chat','early_access'
  ));

-- ── 7. Seed weekly prompts — 8 weeks × 6 categories ──────────────────────────
insert into public.weekly_prompts (category, prompt_text, week_number) values

-- Fashion
('fashion', 'What''s one fashion trend you''re loving right now?', 1),
('fashion', 'Show us your favorite outfit this week.', 2),
('fashion', 'Best fashion purchase you''ve made under $100?', 3),
('fashion', 'What''s one luxury item worth saving for?', 4),
('fashion', 'What''s your go-to "feel good" outfit?', 5),
('fashion', 'What fashion era do you wish would come back?', 6),
('fashion', 'What''s one item in your closet you always reach for?', 7),
('fashion', 'Describe your personal style in three words.', 8),

-- Travel
('travel', 'If BloomBay paid for your flight tomorrow, where are you going?', 1),
('travel', 'Where''s your dream girls'' trip destination?', 2),
('travel', 'What''s the most underrated city you''ve visited?', 3),
('travel', 'What''s your travel essential you never leave home without?', 4),
('travel', 'Best meal you''ve ever had while traveling — where and what?', 5),
('travel', 'What destination surprised you the most?', 6),
('travel', 'Where are you going next?', 7),
('travel', 'What''s a place that changed how you see the world?', 8),

-- Career
('career', 'What''s one thing you wish you knew when you started your career?', 1),
('career', 'What''s a career win you''re proud of this week?', 2),
('career', 'What''s your biggest work challenge right now?', 3),
('career', 'What skill are you currently trying to learn?', 4),
('career', 'Who''s the mentor you needed but didn''t have?', 5),
('career', 'What''s the best career advice you''ve ever received?', 6),
('career', 'What would you do if you weren''t afraid to fail?', 7),
('career', 'What does your ideal workday look like?', 8),

-- Wellness
('wellness', 'What''s one habit that''s improved your life recently?', 1),
('wellness', 'What''s one thing you''re doing for yourself this week?', 2),
('wellness', 'What''s your favorite healthy meal lately?', 3),
('wellness', 'How are you managing stress right now?', 4),
('wellness', 'What''s your non-negotiable self-care ritual?', 5),
('wellness', 'What''s something you do that always lifts your mood?', 6),
('wellness', 'How do you wind down at the end of the day?', 7),
('wellness', 'What does feeling well look like for you?', 8),

-- Friendships
('friendships', 'What''s the best advice a friend has ever given you?', 1),
('friendships', 'What''s a green flag you look for in a new friend?', 2),
('friendships', 'How do you maintain friendships when life gets busy?', 3),
('friendships', 'What''s something you love doing with your friends?', 4),
('friendships', 'What''s one thing that makes you a good friend?', 5),
('friendships', 'When did you last make a new real friend and how?', 6),
('friendships', 'What''s your love language with your friends?', 7),
('friendships', 'Shout out a woman who''s shown up for you recently ♡', 8),

-- City / NYC
('city', 'Best coffee shop in your neighborhood this week?', 1),
('city', 'Anyone want to attend an event this weekend?', 2),
('city', 'Looking for brunch recs — where are you going?', 3),
('city', 'What''s a hidden gem in your borough?', 4),
('city', 'What neighborhood do you love and why?', 5),
('city', 'Best dinner spot you''ve discovered recently?', 6),
('city', 'Where do you go when you need to clear your head in the city?', 7),
('city', 'What''s happening in your area this weekend?', 8)

on conflict (category, week_number) do nothing;
