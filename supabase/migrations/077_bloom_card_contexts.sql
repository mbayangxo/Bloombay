-- Add context column to yande_questions
ALTER TABLE public.yande_questions
  ADD COLUMN IF NOT EXISTS bloom_context text
  CHECK (bloom_context IN ('club_mama', 'host', 'attendee', 'meetup'));

-- Existing bloom_card rows → attendee context
UPDATE public.yande_questions
SET bloom_context = 'attendee'
WHERE kind = 'bloom_card' AND bloom_context IS NULL;

-- Club Mama cards (intimate, deep — for Yande's own Club Mamas running circles)
INSERT INTO public.yande_questions (kind, prompt, bloom_context, sort_order) VALUES
  ('bloom_card', 'Something you''ve been afraid to say out loud until now.', 'club_mama', 10),
  ('bloom_card', 'A version of yourself you''ve outgrown this year.', 'club_mama', 11),
  ('bloom_card', 'What you need from the women in this room.', 'club_mama', 12),
  ('bloom_card', 'Something you''ve never been witnessed in.', 'club_mama', 13),
  ('bloom_card', 'The thing you keep starting and stopping.', 'club_mama', 14),
  ('bloom_card', 'What you would say to yourself five years ago.', 'club_mama', 15),
  ('bloom_card', 'The part of your story you rarely tell.', 'club_mama', 16)
ON CONFLICT DO NOTHING;

-- Host cards (energy-setting, for any event host opening the room)
INSERT INTO public.yande_questions (kind, prompt, bloom_context, sort_order) VALUES
  ('bloom_card', 'What brought you into this room tonight?', 'host', 20),
  ('bloom_card', 'Something you''re looking forward to this season.', 'host', 21),
  ('bloom_card', 'One word that describes where you are right now.', 'host', 22),
  ('bloom_card', 'A woman who changed how you see yourself.', 'host', 23),
  ('bloom_card', 'The last thing that genuinely excited you.', 'host', 24),
  ('bloom_card', 'Something you''d want the women here to know about you.', 'host', 25)
ON CONFLICT DO NOTHING;

-- Meetup cards (1:1, for two members who just connected via QR)
INSERT INTO public.yande_questions (kind, prompt, bloom_context, sort_order) VALUES
  ('bloom_card', 'Something about you that takes people by surprise.', 'meetup', 30),
  ('bloom_card', 'What you wish you could say to someone right now.', 'meetup', 31),
  ('bloom_card', 'The thing you''re working on that scares you a little.', 'meetup', 32),
  ('bloom_card', 'A place in the city that feels like yours.', 'meetup', 33),
  ('bloom_card', 'What a perfect evening looks like for you.', 'meetup', 34),
  ('bloom_card', 'Something you''re proud of that you don''t say enough.', 'meetup', 35)
ON CONFLICT DO NOTHING;
