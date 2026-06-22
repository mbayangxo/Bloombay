-- Come With Me posts: spontaneous activity invitations
CREATE TABLE IF NOT EXISTS public.come_with_me_posts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post         text        NOT NULL CHECK (char_length(post) BETWEEN 10 AND 400),
  activity     text        NOT NULL,  -- "Museum", "Coffee", "Run", "Event", etc.
  when_text    text,                  -- "Saturday · 10AM", "Sunday afternoon"
  emoji        text        DEFAULT '🌸',
  spots_left   integer     DEFAULT 1,
  expires_at   timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.come_with_me_joins (
  post_id    uuid NOT NULL REFERENCES public.come_with_me_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.come_with_me_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.come_with_me_joins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cwm_read_active" ON public.come_with_me_posts FOR SELECT USING (expires_at > now());
CREATE POLICY "cwm_insert_own" ON public.come_with_me_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cwm_delete_own" ON public.come_with_me_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "cwm_joins_read" ON public.come_with_me_joins FOR SELECT USING (true);
CREATE POLICY "cwm_joins_insert" ON public.come_with_me_joins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bloom Requests: the core connection action
CREATE TABLE IF NOT EXISTS public.bloom_requests (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message       text,
  status        text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  sent_at       timestamptz NOT NULL DEFAULT now(),
  responded_at  timestamptz,
  UNIQUE (sender_id, recipient_id)
);

ALTER TABLE public.bloom_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bloom_req_read_own" ON public.bloom_requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "bloom_req_insert_own" ON public.bloom_requests FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "bloom_req_update_recipient" ON public.bloom_requests FOR UPDATE
  USING (auth.uid() = recipient_id);

CREATE INDEX IF NOT EXISTS idx_bloom_requests_recipient ON public.bloom_requests(recipient_id, status, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_bloom_requests_sender ON public.bloom_requests(sender_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_come_with_me_active ON public.come_with_me_posts(expires_at DESC, created_at DESC);
