-- BloomBay 011: member mailbox (welcome + messages in account)

CREATE TABLE IF NOT EXISTS public.member_mailbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  from_name text NOT NULL DEFAULT 'BloomBay',
  subject text NOT NULL,
  body text NOT NULL,
  message_type text NOT NULL DEFAULT 'message'
    CHECK (message_type IN ('message', 'invitation', 'ping', 'welcome')),
  href text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS member_mailbox_user_idx
  ON public.member_mailbox_messages (user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS member_mailbox_welcome_unique
  ON public.member_mailbox_messages (user_id)
  WHERE (message_type = 'welcome');

ALTER TABLE public.member_mailbox_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mailbox read own" ON public.member_mailbox_messages;
CREATE POLICY "Mailbox read own"
  ON public.member_mailbox_messages FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Mailbox update own" ON public.member_mailbox_messages;
CREATE POLICY "Mailbox update own"
  ON public.member_mailbox_messages FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
