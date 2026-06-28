-- BloomBay 071: Club Mama broadcast system
-- Stores broadcasts sent from Club Mamas to their club members.

do $$ begin
  create type broadcast_type as enum (
    'ping',
    'photo',
    'poll',
    'question',
    'event_invite',
    'pin_drop'
  );
exception
  when duplicate_object then null;
end $$;

CREATE TABLE IF NOT EXISTS public.club_broadcasts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id         uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  sent_by         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            broadcast_type NOT NULL DEFAULT 'ping',
  title           text,
  body            text NOT NULL,
  photo_url       text,
  poll_options    jsonb,   -- [{text: string, votes: number}]
  gathering_id    uuid REFERENCES public.gatherings(id) ON DELETE SET NULL,
  recipient_count integer NOT NULL DEFAULT 0,
  sent_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS club_broadcasts_club_id_idx ON public.club_broadcasts (club_id, sent_at DESC);

-- Poll responses
CREATE TABLE IF NOT EXISTS public.broadcast_poll_responses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id uuid NOT NULL REFERENCES public.club_broadcasts(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index integer NOT NULL,
  responded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (broadcast_id, user_id)
);

-- Open question replies
CREATE TABLE IF NOT EXISTS public.broadcast_replies (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id uuid NOT NULL REFERENCES public.club_broadcasts(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         text NOT NULL,
  replied_at   timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.club_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "club_owner_broadcasts_all" ON public.club_broadcasts;
DROP POLICY IF EXISTS "club_members_read_broadcasts" ON public.club_broadcasts;
DROP POLICY IF EXISTS "ops_read_broadcasts" ON public.club_broadcasts;
DROP POLICY IF EXISTS "member_poll_responses" ON public.broadcast_poll_responses;
DROP POLICY IF EXISTS "member_broadcast_replies" ON public.broadcast_replies;

-- Club owner can read/write broadcasts for their own club
CREATE POLICY "club_owner_broadcasts_all"
  ON public.club_broadcasts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clubs
      WHERE clubs.id = club_broadcasts.club_id
        AND clubs.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clubs
      WHERE clubs.id = club_broadcasts.club_id
        AND clubs.owner_id = auth.uid()
    )
  );

-- Members of the club can read broadcasts (club_memberships uses club_slug)
CREATE POLICY "club_members_read_broadcasts"
  ON public.club_broadcasts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.club_memberships cm
      INNER JOIN public.clubs c ON c.slug = cm.club_slug
      WHERE c.id = club_broadcasts.club_id
        AND cm.user_id = auth.uid()
    )
  );

-- Members can respond to polls for their clubs
CREATE POLICY "member_poll_responses"
  ON public.broadcast_poll_responses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Members can reply to questions for their clubs
CREATE POLICY "member_broadcast_replies"
  ON public.broadcast_replies FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Founders/admins can read all
CREATE POLICY "ops_read_broadcasts"
  ON public.club_broadcasts FOR SELECT
  TO authenticated
  USING (public.has_ops_role());
