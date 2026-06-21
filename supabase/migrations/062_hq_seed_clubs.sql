-- 062_hq_seed_clubs.sql
-- Seed Bloombay HQ curated clubs
-- owner_id = NULL → owned by system / Bloombay HQ
-- Run once; safe to re-run (on conflict do nothing)

insert into public.clubs (
  id, name, slug, description, category,
  primary_color, accent_color, emoji,
  membership_type, is_active, tagline
) values

  ('bb000001-0000-0000-0000-000000000001',
   'Walk & Talk Club', 'walk-and-talk',
   'Morning walks, good conversations, great women. No agenda, just movement and connection.',
   'active', '#2D6A4F', '#1A3D2C', '🚶‍♀️', 'open', true, 'Move. Talk. Connect.'),

  ('bb000002-0000-0000-0000-000000000002',
   'Supper Club NYC', 'supper-club-nyc',
   'Private dinners, shared tables, unforgettable evenings. We eat well and talk better.',
   'food', '#C9504A', '#7A1C2E', '🍽️', 'open', true, 'Eat well. Talk better.'),

  ('bb000003-0000-0000-0000-000000000003',
   'Museum Girls', 'museum-girls',
   'Art, exhibitions, froyo after. Culture runs through us.',
   'arts', '#6B4FA0', '#2D1A5E', '🖼️', 'open', true, 'See art together.'),

  ('bb000004-0000-0000-0000-000000000004',
   'Book Society', 'book-society',
   'Monthly reads, honest reviews, and the kind of conversations that go until midnight.',
   'books', '#B5451B', '#6A2210', '📚', 'open', true, 'Read. Reflect. Gather.'),

  ('bb000005-0000-0000-0000-000000000005',
   'Soft Life Club', 'soft-life-club',
   'Rest is radical. We protect our peace, prioritize joy, and build the life we actually want.',
   'wellness', '#C96B9E', '#7A2250', '🌸', 'open', true, 'Rest is radical.'),

  ('bb000006-0000-0000-0000-000000000006',
   'Aperitivo Girls', 'aperitivo-girls',
   'Pre-dinner drinks, golden hour, no bad vibes. Spritz in hand, heels optional.',
   'drinks', '#E07040', '#8A3810', '🍹', 'open', true, 'Spritz. Golden hour. Good company.'),

  ('bb000007-0000-0000-0000-000000000007',
   'Run Club NYC', 'run-club-nyc',
   'Early mornings, endorphins, and women who keep showing up. All paces welcome.',
   'active', '#1A6B8A', '#0E3D52', '🏃‍♀️', 'open', true, 'All paces. All welcome.'),

  ('bb000008-0000-0000-0000-000000000008',
   'Women in Lens', 'women-in-lens',
   'Photography, film, and seeing the world through her eyes. Shoots, critiques, exhibitions.',
   'creative', '#4A3728', '#2A1E15', '📷', 'open', true, 'She sees the world differently.'),

  ('bb000009-0000-0000-0000-000000000009',
   'Flower Girls', 'flower-girls',
   'Floral design, seasonal arrangements, and the art of making things beautiful.',
   'creative', '#D4547A', '#8A2048', '🌺', 'open', true, 'Make things beautiful.'),

  ('bb000010-0000-0000-0000-000000000010',
   'Yoga & Mimosas', 'yoga-and-mimosas',
   'Sunday practice, then brunch. Because balance is everything.',
   'wellness', '#7B9E60', '#4A6038', '🧘‍♀️', 'open', true, 'Practice. Brunch. Repeat.'),

  ('bb000011-0000-0000-0000-000000000011',
   'Creative Collective', 'creative-collective',
   'Designers, writers, builders, artists. We make things and we make each other better.',
   'creative', '#3A2D5F', '#1E1830', '✏️', 'open', true, 'We make things.'),

  ('bb000012-0000-0000-0000-000000000012',
   'Money Moves', 'money-moves',
   'Investing, negotiating, building wealth. The financial conversations women deserve.',
   'career', '#2D4A2D', '#162218', '💰', 'open', true, 'Build your wealth.'),

  ('bb000013-0000-0000-0000-000000000013',
   'Book Bodies', 'book-bodies',
   'We read. We discuss. We break it down. Literary fiction, essays, poetry — all the words.',
   'books', '#8B4513', '#5A2B0A', '📖', 'open', true, 'For the girls who read.'),

  ('bb000014-0000-0000-0000-000000000014',
   'Fine Art Society', 'fine-art-society',
   'Museums, galleries, exhibitions together. We go slow, look closely, and talk about what we see.',
   'arts', '#1C3A5E', '#0E1E32', '🎨', 'open', true, 'Look. Linger. Discuss.'),

  ('bb000015-0000-0000-0000-000000000015',
   'Matcha & Movement', 'matcha-and-movement',
   'Workout, stretch, then matcha. The morning routine that actually sticks when you do it together.',
   'wellness', '#4A7C59', '#2A4A34', '🍵', 'open', true, 'Move. Sip. Repeat.')

on conflict (id) do nothing;
