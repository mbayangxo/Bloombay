-- BloomBay 072: Personal pin drops — send to bouquet or specific bloomies

-- Add visibility + recipients to pin_drops
ALTER TABLE public.pin_drops
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'bouquet', 'private'));

-- Who this pin drop was sent to (for bouquet/private pins)
CREATE TABLE IF NOT EXISTS public.pin_drop_recipients (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_id     uuid NOT NULL REFERENCES public.pin_drops(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notified   boolean NOT NULL DEFAULT false,
  UNIQUE (pin_id, user_id)
);

ALTER TABLE public.pin_drop_recipients ENABLE ROW LEVEL SECURITY;

-- Owner can read their own sent pins and recipients
CREATE POLICY "pin_recipients_owner_read"
  ON public.pin_drop_recipients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pin_drops pd
      WHERE pd.id = pin_drop_recipients.pin_id
        AND pd.user_id = auth.uid()
    )
  );

-- Recipients can read their own
CREATE POLICY "pin_recipients_self_read"
  ON public.pin_drop_recipients FOR SELECT
  USING (auth.uid() = user_id);

-- Allow 'pin_drop' notification type
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'flower','seat','event','message','club','club_accepted',
    'intro','celebrate','club_new_post','gathering','pin_drop'
  ));
