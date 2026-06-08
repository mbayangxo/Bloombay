-- BloomBay 012: founder-editable automated message templates

CREATE TABLE IF NOT EXISTS public.message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  channel text NOT NULL CHECK (channel IN ('email', 'sms', 'in_app')),
  subject text,
  body text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_templates_key_idx ON public.message_templates (key);

ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Message templates ops read" ON public.message_templates;
CREATE POLICY "Message templates ops read"
  ON public.message_templates FOR SELECT
  TO authenticated
  USING (public.has_ops_role());

DROP POLICY IF EXISTS "Message templates ops write" ON public.message_templates;
CREATE POLICY "Message templates ops write"
  ON public.message_templates FOR ALL
  TO authenticated
  USING (public.has_ops_role())
  WITH CHECK (public.has_ops_role());

INSERT INTO public.message_templates (key, channel, subject, body)
VALUES
  (
    'member_welcome_email',
    'email',
    'Welcome to BloomBay, {{first_name}}',
    'Hi {{first_name}},

Welcome to BloomBay — women meeting women IRL in {{place}}.

Open seats, clubs, and tonight in the city are waiting for you.

Enter BloomBay: {{app_url}}/member/home

— BloomBay'
  ),
  (
    'member_welcome_sms',
    'sms',
    NULL,
    'Welcome to BloomBay, {{first_name}}! You''re in{{place_suffix}}. Open BloomBay for seats, clubs & tonight in the city.'
  ),
  (
    'member_welcome_in_app',
    'in_app',
    'Welcome to BloomBay, {{first_name}}',
    'Hi {{first_name}},

Welcome to BloomBay — women meeting women IRL in {{place}}.

Open seats, clubs, and tonight in the city are waiting for you. Tap below to enter your home feed.

— BloomBay'
  ),
  (
    'seat_confirmed_email',
    'email',
    'Seat saved — {{title}}',
    'Hi {{first_name}},

Your seat is saved for {{title}}{{venue_suffix}}{{when_suffix}}.

See you there,
BloomBay'
  ),
  (
    'seat_confirmed_sms',
    'sms',
    NULL,
    'BloomBay: Your seat is saved for {{title}}{{venue_suffix}}{{when_suffix}}. See you there, {{first_name}}.'
  ),
  (
    'event_reminder_sms',
    'sms',
    NULL,
    'BloomBay reminder: {{title}} on {{when}}{{place_suffix}}. Open BloomBay when you''re ready.'
  ),
  (
    'club_approved_email',
    'email',
    'You''re approved — {{club_name}}',
    'Hi {{first_name}},

Great news — you''re approved for {{club_name}} on BloomBay.

Open the club world and say hello to your people.

— BloomBay'
  ),
  (
    'waitlist_approved_email',
    'email',
    'You''re off the waitlist, {{first_name}}',
    'Hi {{first_name}},

You''re off the BloomBay waitlist — welcome in.

Create your member account and we''ll see you in the city.

— BloomBay'
  )
ON CONFLICT (key) DO NOTHING;
