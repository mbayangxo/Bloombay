-- 073: Bloom scan streaks
-- Tracks consecutive IRL meetings via QR code scans between members.
-- canonical pair: user_a < user_b (no duplicate pairs)

ALTER TABLE public.bloom_requests
  ADD COLUMN IF NOT EXISTS data jsonb;

CREATE TABLE IF NOT EXISTS public.bloom_scan_streaks (
  user_a          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak_count    integer     NOT NULL DEFAULT 1,
  last_scan_at    timestamptz NOT NULL DEFAULT now(),
  longest_streak  integer     NOT NULL DEFAULT 1,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_a, user_b),
  CONSTRAINT pair_order CHECK (user_a < user_b)
);

ALTER TABLE public.bloom_scan_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "streak_read_own"
  ON public.bloom_scan_streaks FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "streak_upsert_own"
  ON public.bloom_scan_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "streak_update_own"
  ON public.bloom_scan_streaks FOR UPDATE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE INDEX IF NOT EXISTS bloom_scan_streaks_a_idx ON public.bloom_scan_streaks(user_a, streak_count DESC);
CREATE INDEX IF NOT EXISTS bloom_scan_streaks_b_idx ON public.bloom_scan_streaks(user_b, streak_count DESC);

-- also add friend_scans if missing (from migration 006 but may not exist everywhere)
CREATE TABLE IF NOT EXISTS public.friend_scans (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scanned_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id      uuid,
  scanned_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.friend_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "friend_scans_own" ON public.friend_scans FOR SELECT
  USING (auth.uid() = initiator_id OR auth.uid() = scanned_id);

CREATE POLICY "friend_scans_insert" ON public.friend_scans FOR INSERT
  WITH CHECK (auth.uid() = initiator_id);
