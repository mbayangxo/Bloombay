-- Member Preferences v2 — Migration 065
--
-- Adds five new signal fields identified from research:
--   seeking[]         — what kind of friendship she wants right now
--   life_chapter      — shared chapter creates instant bond
--   lifestyle_tags    — upgraded from text[] to jsonb with must/nice weights
--   availability[]    — when she's actually free
--   connection_frequency — how often she wants to hang
--   aspirations[]     — who she's becoming (strongest latent signal)

-- Add new columns to existing member_preferences table
ALTER TABLE public.member_preferences
  -- What she's looking for in a friendship right now
  ADD COLUMN IF NOT EXISTS seeking            text[]  DEFAULT '{}',
  -- Canonical values: 'creative_collaborator', 'workout_partner', 'travel_companion',
  --   'events_plus_one', 'deep_friendship', 'mentor', 'mentee', 'business_connection',
  --   'girls_brunch_crew', 'accountability_partner', 'neighborhood_friend'

  -- The life chapter she's in — shared chapter = instant bond
  ADD COLUMN IF NOT EXISTS life_chapter       text,
  -- Canonical values: 'new_to_nyc', 'newly_single', 'newly_divorced', 'recently_engaged',
  --   'newly_married', 'new_mom', 'postpartum', 'career_pivot', 'starting_a_business',
  --   'newly_sober', 'grieving', 'healing', 'thriving_and_expanding', 'empty_nester',
  --   'student', 'established_and_rooted'

  -- Availability — when she's actually free to hang
  ADD COLUMN IF NOT EXISTS availability       text[]  DEFAULT '{}',
  -- Canonical values: 'weekday_mornings', 'weekday_afternoons', 'weekday_evenings',
  --   'weekend_mornings', 'weekend_afternoons', 'weekend_evenings', 'flexible'

  -- How often she wants to connect with friends
  ADD COLUMN IF NOT EXISTS connection_frequency text,
  -- Canonical values: 'weekly', 'biweekly', 'monthly', 'occasionally', 'spontaneous'

  -- Who she's becoming — strongest latent compatibility signal
  ADD COLUMN IF NOT EXISTS aspirations        text[]  DEFAULT '{}';
  -- Canonical values: 'more_creative', 'more_active', 'explore_faith', 'go_sober',
  --   'start_a_business', 'travel_more', 'build_community', 'find_my_purpose',
  --   'slow_down', 'be_more_social', 'learn_something_new', 'heal', 'grow_spiritually'

-- Upgrade lifestyle_tags from text[] to weighted jsonb
-- Each entry: { "tag": "sober", "weight": "must" | "nice" }
-- We keep the old text[] as backup during migration, then drop it.
ALTER TABLE public.member_preferences
  ADD COLUMN IF NOT EXISTS lifestyle_tags_weighted jsonb DEFAULT '[]';

-- Migrate existing text[] lifestyle_tags → weighted jsonb (default weight = "nice")
UPDATE public.member_preferences
SET lifestyle_tags_weighted = (
  SELECT jsonb_agg(jsonb_build_object('tag', t, 'weight', 'nice'))
  FROM   unnest(lifestyle_tags) t
)
WHERE  lifestyle_tags IS NOT NULL
  AND  array_length(lifestyle_tags, 1) > 0
  AND  lifestyle_tags_weighted = '[]'::jsonb;

-- Helper view that flattens weighted tags back to text[] for easy querying
CREATE OR REPLACE VIEW member_lifestyle_tags AS
SELECT
  user_id,
  array_agg(elem->>'tag') FILTER (WHERE elem->>'tag' IS NOT NULL) AS all_tags,
  array_agg(elem->>'tag') FILTER (WHERE elem->>'weight' = 'must')  AS must_tags,
  array_agg(elem->>'tag') FILTER (WHERE elem->>'weight' = 'nice')  AS nice_tags
FROM public.member_preferences,
     jsonb_array_elements(lifestyle_tags_weighted) AS elem
GROUP BY user_id;

-- Index on life_chapter for fast cohort queries
CREATE INDEX IF NOT EXISTS idx_prefs_life_chapter    ON public.member_preferences(life_chapter);
CREATE INDEX IF NOT EXISTS idx_prefs_conn_frequency  ON public.member_preferences(connection_frequency);
