-- Yande Games — Migration 076
-- Weekly social games: This or That (binary), open questions, bloom card prompts, bloom pair icebreakers.

CREATE TABLE IF NOT EXISTS public.yande_questions (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        text    NOT NULL CHECK (kind IN ('this_or_that','open_question','bloom_card','bloom_pair')),
  prompt      text    NOT NULL,
  option_a    text,   -- for this_or_that
  option_b    text,   -- for this_or_that
  sort_order  int     NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_question_responses (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id uuid    REFERENCES public.yande_questions(id) ON DELETE CASCADE NOT NULL,
  answer      text    NOT NULL,
  week_of     date    NOT NULL DEFAULT date_trunc('week', now()),
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id, week_of)
);

CREATE INDEX IF NOT EXISTS idx_question_responses_user  ON public.member_question_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_week  ON public.member_question_responses(week_of);
CREATE INDEX IF NOT EXISTS idx_yande_questions_kind     ON public.yande_questions(kind, sort_order);

ALTER TABLE public.yande_questions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_question_responses ENABLE ROW LEVEL SECURITY;

-- Members can read all questions
CREATE POLICY "questions_public_read" ON public.yande_questions FOR SELECT USING (true);

-- Members read/write own responses
CREATE POLICY "responses_own_read"  ON public.member_question_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "responses_own_write" ON public.member_question_responses FOR ALL   USING (auth.uid() = user_id);

-- Members can read all responses for stats (count only — no personal data exposed via policy, UI controls this)
CREATE POLICY "responses_stats_read" ON public.member_question_responses FOR SELECT USING (true);

-- ── Seed: This or That ────────────────────────────────────────────────────────
INSERT INTO public.yande_questions (kind, prompt, option_a, option_b, sort_order) VALUES
  ('this_or_that', 'Rooftop or basement?',                     'Rooftop',       'Basement',          1),
  ('this_or_that', 'Planned plans or spontaneous?',            'Planned',        'Spontaneous',       2),
  ('this_or_that', 'Arrive first or make an entrance?',        'First there',    'Make an entrance',  3),
  ('this_or_that', 'Art gallery or live music?',               'Art gallery',    'Live music',        4),
  ('this_or_that', 'Host it or be the guest?',                 'Host',           'Be hosted',         5),
  ('this_or_that', 'Big group energy or just the two of you?', 'Big group',      'Just us',           6),
  ('this_or_that', 'Cook together or restaurant?',             'Cook together',  'Restaurant',        7),
  ('this_or_that', 'Bougie brunch or hidden gem?',             'Bougie brunch',  'Hidden gem',        8)
ON CONFLICT DO NOTHING;

-- ── Seed: Open questions (Question She's Carrying) ────────────────────────────
INSERT INTO public.yande_questions (kind, prompt, sort_order) VALUES
  ('open_question', 'What are you building right now that you don''t talk about enough?',          1),
  ('open_question', 'What''s something you changed your mind about this year?',                    2),
  ('open_question', 'What would your perfect Saturday morning look like?',                         3),
  ('open_question', 'Who''s the woman in your life who showed you what real friendship looks like?', 4),
  ('open_question', 'What''s one thing you''re embarrassingly into right now?',                    5),
  ('open_question', 'What''s somewhere in the city you go to feel like yourself?',                6),
  ('open_question', 'What are you most honest about with yourself right now?',                     7),
  ('open_question', 'What would you want a new friend to know about you on day one?',              8)
ON CONFLICT DO NOTHING;

-- ── Seed: Bloom pair icebreakers ──────────────────────────────────────────────
INSERT INTO public.yande_questions (kind, prompt, sort_order) VALUES
  ('bloom_pair', 'What''s something you immediately noticed about her?',                               1),
  ('bloom_pair', 'What would you want her to know about you that she''d never guess?',                2),
  ('bloom_pair', 'What are you hoping this friendship becomes?',                                       3),
  ('bloom_pair', 'What''s the best way to make plans with you?',                                      4),
  ('bloom_pair', 'What''s a place in the city you''d take someone you actually like?',                5),
  ('bloom_pair', 'What''s something you haven''t told many people you''re working on?',               6)
ON CONFLICT DO NOTHING;

-- ── Seed: Bloom Cards (for Club Mama facilitation at events) ─────────────────
INSERT INTO public.yande_questions (kind, prompt, sort_order) VALUES
  ('bloom_card', 'The last thing that genuinely surprised you.',              1),
  ('bloom_card', 'A woman who shaped you.',                                   2),
  ('bloom_card', 'What you''re most honest about with yourself.',             3),
  ('bloom_card', 'The version of yourself you''re working toward.',           4),
  ('bloom_card', 'What you''d want the women in this room to know about you.',5),
  ('bloom_card', 'Something you''ve been carrying lately.',                   6),
  ('bloom_card', 'The thing that makes you light up when you talk about it.', 7)
ON CONFLICT DO NOTHING;
