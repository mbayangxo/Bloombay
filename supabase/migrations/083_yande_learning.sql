-- ── Yande Learning Infrastructure ────────────────────────────────────────────
-- Yande is a single AI across all BloomBay apps.
-- She learns from signals (behavioral events), builds memory per user,
-- and over time improves compatibility matching across GirlMates, Introductions,
-- Clubs, and any future app on the Yande OS backbone.

-- ── 1. Signal Stream ─────────────────────────────────────────────────────────
-- Raw behavioral events from every app and feature.
-- Yande reads these to understand what women actually do (not just what they say).

create table if not exists public.yande_signals (
  id            uuid        primary key default gen_random_uuid(),
  app           text        not null default 'bloombay',
                            -- 'bloombay' | 'llk' | 'girlmate_standalone' | etc.
  feature       text        not null,
                            -- 'girlmate' | 'introductions' | 'clubs' | 'avenue' | 'passport'
  event_type    text        not null,
                            -- see event glossary below
  actor_id      uuid        references public.profiles(id) on delete set null,
  target_id     uuid,       -- user being viewed/messaged/matched (nullable — can be content)
  object_id     uuid,       -- listing id, post id, club id, etc.
  object_type   text,       -- 'girlmate_listing' | 'intro' | 'club' | 'event' | etc.
  meta          jsonb,      -- any additional context (compat score, field overlap, etc.)
  created_at    timestamptz not null default now()
);

-- Event glossary (event_type values):
--   girlmate: profile_viewed, message_sent, accepted, declined_kindly, ghosted,
--             moved_in_confirmed, quiz_completed, listing_posted
--   introductions: bloom_request_sent, bloom_request_accepted, bloom_request_declined,
--                  came_with_me, met_at_event
--   clubs: joined, attended_event, co_attended (both went to same event)
--   avenue: post_saved, post_flowers, post_ignored
--   yande: recommendation_acted_on, recommendation_ignored

alter table public.yande_signals enable row level security;

-- Service role writes; members can only read their own signals
create policy "yande_signals_actor_read" on public.yande_signals
  for select using (auth.uid() = actor_id);

create policy "yande_signals_service_write" on public.yande_signals
  for insert with check (true);

create index if not exists yande_signals_actor_idx   on public.yande_signals(actor_id, created_at desc);
create index if not exists yande_signals_target_idx  on public.yande_signals(target_id, created_at desc);
create index if not exists yande_signals_feature_idx on public.yande_signals(feature, event_type, created_at desc);
create index if not exists yande_signals_app_idx     on public.yande_signals(app, created_at desc);

-- ── 2. Match Outcomes ─────────────────────────────────────────────────────────
-- Ground truth for learning: what actually happened after a connection.
-- This is what Yande trains on to improve compatibility predictions.

create table if not exists public.yande_match_outcomes (
  id                    uuid        primary key default gen_random_uuid(),
  user_a_id             uuid        not null references public.profiles(id) on delete cascade,
  user_b_id             uuid        not null references public.profiles(id) on delete cascade,
  feature               text        not null,  -- 'girlmate' | 'introductions' | 'clubs'
  outcome               text        not null,
                                    -- 'connected' | 'met_in_person' | 'moved_in' |
                                    -- 'ghosted' | 'declined_kindly' | 'no_response'
  compat_score_at_match integer,    -- Yande's predicted score at the time of match
  field_overlaps        jsonb,      -- which profile fields matched (for learning weights)
  days_to_outcome       integer,    -- how long between connection and outcome
  reported_by           uuid        references public.profiles(id),
  created_at            timestamptz not null default now()
);

alter table public.yande_match_outcomes enable row level security;

create policy "yande_outcomes_participant_read" on public.yande_match_outcomes
  for select using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create index if not exists yande_outcomes_user_a   on public.yande_match_outcomes(user_a_id);
create index if not exists yande_outcomes_user_b   on public.yande_match_outcomes(user_b_id);
create index if not exists yande_outcomes_feature  on public.yande_match_outcomes(feature, outcome);

-- ── 3. Compatibility Weights ──────────────────────────────────────────────────
-- What Yande has learned about which profile field overlaps predict good matches.
-- Updated by the weekly learning cron after analyzing match outcomes.

create table if not exists public.yande_compat_weights (
  id            uuid        primary key default gen_random_uuid(),
  feature       text        not null,  -- 'girlmate' | 'introductions'
  field_name    text        not null,  -- 'cleanliness_level' | 'religion' | 'lifestyle_tags' | etc.
  weight        float       not null default 1.0,  -- higher = more predictive of success
  sample_size   integer     not null default 0,    -- how many outcomes informed this weight
  last_updated  timestamptz not null default now(),
  unique (feature, field_name)
);

-- Seed default weights for GirlMate fields
-- (These get updated automatically as real outcomes come in)
insert into public.yande_compat_weights (feature, field_name, weight, sample_size) values
  ('girlmate', 'cleanliness_level',  2.0, 0),
  ('girlmate', 'noise_level',        1.8, 0),
  ('girlmate', 'sleep_schedule',     1.7, 0),
  ('girlmate', 'guest_frequency',    1.6, 0),
  ('girlmate', 'smoking',            1.9, 0),
  ('girlmate', 'pets',               1.5, 0),
  ('girlmate', 'halal_kitchen',      1.8, 0),
  ('girlmate', 'religion',           1.4, 0),
  ('girlmate', 'lifestyle_tags',     1.3, 0),
  ('girlmate', 'mom_status',         1.2, 0),
  ('girlmate', 'drinking',           1.5, 0),
  ('girlmate', 'personality_type',   1.1, 0),
  ('girlmate', 'age_range',          0.9, 0),
  ('girlmate', 'interests',          0.8, 0),
  ('introductions', 'clubs',         2.0, 0),
  ('introductions', 'neighborhood',  1.5, 0),
  ('introductions', 'interests',     1.3, 0)
on conflict (feature, field_name) do nothing;

-- ── 4. Yande Proactive Queue ──────────────────────────────────────────────────
-- When Yande identifies two women who should meet, she queues a suggestion.
-- These are surfaced in the UI as "Yande thinks you should meet her."

create table if not exists public.yande_match_queue (
  id              uuid        primary key default gen_random_uuid(),
  user_a_id       uuid        not null references public.profiles(id) on delete cascade,
  user_b_id       uuid        not null references public.profiles(id) on delete cascade,
  feature         text        not null,  -- 'girlmate' | 'introductions'
  compat_score    integer     not null,  -- Yande's confidence (0–100)
  reason          text,                  -- human-readable reason for the match
  signal_count    integer     not null default 0,  -- how many mutual signals drove this
  status          text        not null default 'pending',
                              -- 'pending' | 'shown' | 'acted_on' | 'dismissed'
  shown_at        timestamptz,
  created_at      timestamptz not null default now(),
  unique (user_a_id, user_b_id, feature)  -- no duplicate suggestions
);

alter table public.yande_match_queue enable row level security;

create policy "yande_queue_own_read" on public.yande_match_queue
  for select using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create index if not exists yande_queue_user_a   on public.yande_match_queue(user_a_id, status);
create index if not exists yande_queue_score    on public.yande_match_queue(compat_score desc, created_at desc);
