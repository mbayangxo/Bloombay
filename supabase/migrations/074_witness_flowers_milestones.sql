-- Flowers: simple affirmation sent after events
CREATE TABLE IF NOT EXISTS public.bloom_flowers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gathering_id  uuid REFERENCES public.gatherings(id) ON DELETE SET NULL,
  note          text,
  sent_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (from_user_id, to_user_id, gathering_id)
);
ALTER TABLE public.bloom_flowers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flowers_read_own" ON public.bloom_flowers FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "flowers_insert_own" ON public.bloom_flowers FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE INDEX IF NOT EXISTS bloom_flowers_to_idx ON public.bloom_flowers(to_user_id, sent_at DESC);

-- Member milestones: personal autobiography milestones
CREATE TABLE IF NOT EXISTS public.member_milestones (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind          text NOT NULL,
  title         text NOT NULL,
  body          text,
  meta          jsonb,
  happened_at   timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.member_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones_own" ON public.member_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "milestones_insert_service" ON public.member_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS milestones_user_idx ON public.member_milestones(user_id, happened_at DESC);
