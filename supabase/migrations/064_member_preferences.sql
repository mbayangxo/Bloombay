-- Member Preferences — Migration 064
--
-- Stores values, lifestyle, and life-stage signals used by Yande for
-- compatibility matching. These are the things that actually determine
-- whether two women will click — not just which clubs they're in.

CREATE TABLE IF NOT EXISTS public.member_preferences (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- ── Life stage ────────────────────────────────────────────────────────────
  age_group           text        CHECK (age_group IN ('20s','30s','40s','50+')),
  is_mother           boolean,
  relationship_status text        CHECK (relationship_status IN (
                                    'single','partnered','married','divorced','widowed','complicated'
                                  )),

  -- ── Faith ─────────────────────────────────────────────────────────────────
  -- Free text so members can describe it how they want
  faith               text,
  faith_important     boolean     DEFAULT false,   -- true = would prefer a friend with similar faith

  -- ── Lifestyle tags ────────────────────────────────────────────────────────
  -- What describes her day-to-day life and personal standards
  -- Canonical values (front-end should offer these as chip selections):
  --   'sober'           'sober_curious'    'social_drinker'
  --   'non_smoker'      'smoker'
  --   'plant_based'     'health_conscious' 'foodie'
  --   'early_riser'     'night_owl'
  --   'homebody'        'adventurous'
  --   'spiritual'       'faith_centered'
  --   'entrepreneurial' 'career_focused'   'creative_professional'
  --   'student'         'stay_at_home'
  lifestyle_tags      text[]      DEFAULT '{}',

  -- ── Activity preferences ──────────────────────────────────────────────────
  -- What she actually likes to do
  -- Canonical values:
  --   'art_galleries'   'museums'          'live_music'      'theater'
  --   'creative_workshops' 'cooking_classes' 'pottery'        'dance'
  --   'yoga'            'pilates'          'hiking'          'running'
  --   'book_clubs'      'film_screenings'  'lectures'
  --   'farmers_markets' 'brunching'        'dinner_parties'
  --   'travel'          'staycations'      'pop_ups'         'shopping'
  --   'volunteering'    'mentorship'       'networking'
  activity_types      text[]      DEFAULT '{}',

  -- ── Core values ───────────────────────────────────────────────────────────
  -- What she cares about most — used to find people who share her priorities
  -- Canonical values:
  --   'faith'           'family'           'community'       'creativity'
  --   'wellness'        'career'           'personal_growth' 'adventure'
  --   'authenticity'    'service'          'financial_freedom' 'education'
  core_values         text[]      DEFAULT '{}',

  -- ── Connection style ──────────────────────────────────────────────────────
  friendship_style    text        CHECK (friendship_style IN (
                                    'deep_one_on_one','group_energy','mix_of_both'
                                  )),

  -- ── What she'd rather avoid ───────────────────────────────────────────────
  -- These are SOFT signals — heavy weighting in matching, not hard exclusions
  -- Canonical values:
  --   'heavy_drinking'  'bar_scene'        'nightlife'       'smoking'
  --   'late_nights'     'drama'            'competitive_vibes'
  avoid_vibes         text[]      DEFAULT '{}',

  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_prefs_user    ON public.member_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_member_prefs_age     ON public.member_preferences(age_group);
CREATE INDEX IF NOT EXISTS idx_member_prefs_mother  ON public.member_preferences(is_mother);

ALTER TABLE public.member_preferences ENABLE ROW LEVEL SECURITY;

-- Members can read and write their own preferences
DROP POLICY IF EXISTS "prefs_own_read"  ON public.member_preferences;
DROP POLICY IF EXISTS "prefs_own_write" ON public.member_preferences;

CREATE POLICY "prefs_own_read"
  ON public.member_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "prefs_own_write"
  ON public.member_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Admins / service role can read all (for matching)
DROP POLICY IF EXISTS "prefs_admin_read" ON public.member_preferences;
CREATE POLICY "prefs_admin_read"
  ON public.member_preferences FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','founder'))
  );
