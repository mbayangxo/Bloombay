-- Founder Brand Interviews — Migration 075
-- Stores the AI marketing interview sessions with the founder.
-- Each session is a conversation. Answers build a founder brand profile.

CREATE TABLE IF NOT EXISTS public.founder_brand_interviews (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid        NOT NULL,
  role        text        NOT NULL CHECK (role IN ('assistant', 'user')),
  content     text        NOT NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brand_interviews_session ON public.founder_brand_interviews(session_id, created_at);

-- Only service role can read/write (founder-only feature, accessed via API with service role)
ALTER TABLE public.founder_brand_interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_only"
  ON public.founder_brand_interviews FOR ALL
  USING (false);

CREATE TABLE IF NOT EXISTS public.founder_brand_profile (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_voice     text,
  target_woman    text,
  aesthetic_notes text,
  content_pillars text[]      DEFAULT '{}',
  goals           text,
  raw_answers     jsonb       DEFAULT '{}',
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE public.founder_brand_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_only_profile"
  ON public.founder_brand_profile FOR ALL
  USING (false);
