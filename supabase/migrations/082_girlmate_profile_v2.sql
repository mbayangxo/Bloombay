-- ── GirlMate v2: Comprehensive profile fields for roommate matching ────────────
-- Adds lifestyle, family, religion, personality, house rules, and media fields.

alter table public.girlmate_profiles
  -- Age & age preferences
  add column if not exists age_range           text,
  add column if not exists preferred_age       text[],

  -- Lifestyle tags (multi-select array)
  add column if not exists lifestyle_tags      text[] default '{}',

  -- Personality
  add column if not exists personality_type    text
    check (personality_type in ('introvert','extrovert','ambivert') or personality_type is null),

  -- Cleanliness level
  add column if not exists cleanliness_level   text
    check (cleanliness_level in ('very_tidy','organized','relaxed') or cleanliness_level is null),

  -- Noise / social level
  add column if not exists noise_level         text
    check (noise_level in ('very_quiet','moderate','social') or noise_level is null),

  -- Drinking
  add column if not exists drinking            text
    check (drinking in ('no_alcohol','socially','regularly') or drinking is null),

  -- Family status
  add column if not exists mom_status          text
    check (mom_status in ('is_mom','not_mom','open_to_moms','prefer_child_free') or mom_status is null),

  -- Future kids
  add column if not exists wants_kids          text
    check (wants_kids in ('yes','no','undecided') or wants_kids is null),

  -- Religion (for dietary/lifestyle compatibility)
  add column if not exists religion            text,
  add column if not exists religion_level      text
    check (religion_level in ('very_religious','moderately','not_religious') or religion_level is null),

  -- Move-in timeline
  add column if not exists move_in_timeline    text
    check (move_in_timeline in ('asap','1_3_months','3_6_months','6_plus_months') or move_in_timeline is null),

  -- House rules
  add column if not exists guest_frequency     text
    check (guest_frequency in ('never','occasionally','regularly') or guest_frequency is null),
  add column if not exists kitchen_use         text
    check (kitchen_use in ('cook_often','sometimes','rarely') or kitchen_use is null),
  add column if not exists temp_preference     text
    check (temp_preference in ('cold','moderate','warm') or temp_preference is null),

  -- Structured dealbreakers (array of tags)
  add column if not exists dealbreaker_tags    text[] default '{}',

  -- Likes / interests and deal-breakers (free text)
  add column if not exists interests           text[],
  add column if not exists deal_breakers       text,

  -- Short intro media (uploaded to girlmate-media storage bucket)
  add column if not exists voice_note_url      text,
  add column if not exists video_intro_url     text,

  -- bio column (in case not added yet)
  add column if not exists bio                 text;

-- GIN indexes for filtering
create index if not exists girlmate_lifestyle_gin    on public.girlmate_profiles using gin (lifestyle_tags);
create index if not exists girlmate_interests_gin    on public.girlmate_profiles using gin (interests);
create index if not exists girlmate_dealbreaker_gin  on public.girlmate_profiles using gin (dealbreaker_tags);
